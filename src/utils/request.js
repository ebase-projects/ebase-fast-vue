import axios from 'axios'
import { Message } from 'element-ui'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import el from 'element-ui/src/locale/lang/el'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const CancelToken = axios.CancelToken
const pending = []

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.cancelToken = new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      pending.push(c)
    })

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    return res
    // }
  },
  error => {
    console.log(error.response) // for debug

    if (error.response.status === 400) {
      // if (!error.response.data.msg) {
      const msg = error.response.data.msg
      if (msg.indexOf('Invalid access token') !== -1) {
        // 登录超时，接口请求多次，导致弹框会多次出现，方案：只弹一次
        console.log(pending.length)
        while (pending.length > 0) {
          pending.pop()('请求中断')
        }

        window.location.reload()

        // MessageBox.confirm('登录超时，需要重新登录', '确定重新登录', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   window.location.reload()
        //   // window.location.replace('/')
        // })
      }
      // }

      // return error.response
    } else {
      Message({
        message: error.response.data.error_description ||
          error.response.data.content || error.response.data.msg || '服务器异常，请联系管理员',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
