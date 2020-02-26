import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: 'system/user/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer '
    }
    // params: { token }
  })
}

export function listUser(query) {
  return request({
    url: 'system/user/page',
    method: 'get',
    params: query
  })
}

