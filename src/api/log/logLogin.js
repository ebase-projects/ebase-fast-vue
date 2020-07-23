import request from '@/utils/request'

export function listLogLogin(query) {
  return request({
    url: '/log/login/page',
    method: 'get',
    params: query
  })
}
