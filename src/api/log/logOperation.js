import request from '@/utils/request'

export function listLogOperation(query) {
  return request({
    url: '/log/operation/page',
    method: 'get',
    params: query
  })
}
