import request from '@/utils/request'
export function buildMenus() {
  return request({
    url: 'system/menu/nav',
    method: 'get'
  })
}
