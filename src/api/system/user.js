import request from '@/utils/request'
// 导出excel
import { exportExcelUtil } from '@/utils/exportUtils'

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer '
    }
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

export function exportExcelUser(query, fileName) {
  exportExcelUtil('/system/user/export', fileName, query)
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

export function changeUserStatus(id, status) {
  const data = {
    id: id,
    status: status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}
