import request from '@/utils/request'

export function listDept(query) {
  return request({
    url: '/system/dept/tree',
    method: 'get',
    params: query
  })
}

export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

export function delDept(id) {
  return request({
    url: '/system/dept/' + id,
    method: 'delete'
  })
}

export function updateDept(data) {
  return request({
    url: '/system/dept/',
    method: 'put',
    data: data
  })
}

export function getDept(id) {
  return request({
    url: '/system/dept/' + id,
    method: 'get'
  })
}

export function getDicts(code) {
  return request({
    url: '/system/dept/getdicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}

