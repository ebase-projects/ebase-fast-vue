import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer '
    }
    // params: { token }
  })
}

export function getUserInfo() {
  return request({
    url: '/system/user/info',
    method: 'get'
  })
}

export function listUser(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

export function addUser(form) {
  return request({
    url: '/system/user',
    method: 'post',
    data: form
  })
}

export function updateUser(form) {
  return request({
    url: '/system/user',
    method: 'put',
    data: form
  })
}

export function getUser(id) {
  return request({
    url: '/system/user/' + id,
    method: 'get'
  })
}

export function delUser(ids) {
  return request({
    url: '/system/user',
    method: 'delete',
    data: ids
  })
}

export function updateUserPwd(form) {
  return request({
    url: '/system/user/password',
    method: 'put',
    data: form
  })
}

// 通过枚举获取字典值
export function getUserDictsByEnum(code) {
  return request({
    url: '/system/user/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}
