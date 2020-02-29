import request from '@/utils/request'

export function listDept(query) {
  return request({
    url: '/system/dept/tree',
    method: 'get',
    params: query
  })
}

export function addDept(form) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: form
  })
}

export function delDept(id) {
  return request({
    url: '/system/dept/' + id,
    method: 'delete'
  })
}

export function updateDept(form) {
  return request({
    url: '/system/dept/',
    method: 'put',
    data: form
  })
}

export function getDept(id) {
  return request({
    url: '/system/dept/' + id,
    method: 'get'
  })
}

// 通过枚举获取字典值
export function getDeptDictsByEnum(code) {
  return request({
    url: '/system/dept/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}

