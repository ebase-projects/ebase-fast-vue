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
 * 获取菜单树
 * @returns {AxiosPromise}
 */
export const getMenuTree = () => {
  return request({
    url: 'system/menu/tree',
    method: 'get'
  })
}

export function addMenu(form) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: form
  })
}

export function updateMenu(form) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: form
  })
}

export function getMenu(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'get'
  })
}

export function delMenu(ids) {
  return request({
    url: '/system/menu',
    method: 'delete',
    data: ids
  })
}

// 通过枚举获取字典值
export function getMenuDictsByEnum(code) {
  return request({
    url: '/system/menu/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}
