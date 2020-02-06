import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { buildMenus } from '@/api/system/menu'
import Layout from '@/layout/index'
// import fa from 'element-ui/src/locale/lang/fa'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          // 动态路由，拉取菜单
          loadMenus(next, to)
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRoutes(res.data)
    // asyncRouter.push(
    //   {
    //     path: '/example1',
    //     component: Layout,
    //     redirect: '/example/table1',
    //     name: '222222',
    //     meta: { title: '222222', icon: 'example1' },
    //     children: [
    //       {
    //         path: '/sss',
    //         name: 'aaa',
    //         hidden: false,
    //         component: () => import('@/views/error/404'),
    //         meta: { title: 'aaa', icon: 'aaa' }
    //       }] })

    // asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('permission/generateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export const filterAsyncRoutes = (routes) => {
  return routes.filter(route => {
    console.log('str：' + route.component)
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        const component = route.component.replace(/^\/*/g, '')
        route.component = loadView(component)
      }
      console.log(route.component)
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })
}

export const loadView = (view) => {
  return () => import(`@/views/${view}`)
}
