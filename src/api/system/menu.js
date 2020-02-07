import request from '@/utils/request'

/**
 * 构建左侧菜单
 * @returns {AxiosPromise}
 */
export function buildMenus() {
  return request({
    url: 'system/menu/nav',
    method: 'get'
  })
}

/**
 * 保存菜单
 * @param data
 * @returns {AxiosPromise}
 */
export const saveMenu = (data) => {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

/**
 * 获取菜单树
 * @returns {AxiosPromise}
 */
export const getMenuTree = () => {
  return request({
    url: 'system/menu/tree',
    method: 'get'
  })
}
