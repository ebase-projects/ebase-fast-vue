import request from '@/utils/request'

export function listLogError(query) {
  return request({
    url: '/log/error/page',
    method: 'get',
    params: query
  })
}
