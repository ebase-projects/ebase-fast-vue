import request from '@/utils/request'
import { exportExcelUtil } from '@/utils/exportUtils'

export function listRole(query) {
  return request({
    url: '/system/role/page',
    method: 'get',
    params: query
  })
}
export function listAllRole(query) {
  return request({
    url: '/system/role',
    method: 'get',
    params: query
  })
}

export function addRole(form) {
  return request({
    url: '/system/role',
    method: 'post',
    data: form
  })
}

export function updateRole(form) {
  return request({
    url: '/system/role',
    method: 'put',
    data: form
  })
}

export function getRole(id) {
  return request({
    url: '/system/role/' + id,
    method: 'get'
  })
}

export function getMenuListByRoleId(roleId) {
  return request({
    url: '/system/role/menuList/' + roleId,
    method: 'get'
  })
}

export function getUserPageByRoleId(query) {
  return request({
    url: '/system/role/userPage/' + query.roleId,
    method: 'get',
    params: query
  })
}

export function getUsersByRoleId(roleId) {
  return request({
    url: '/system/role/userList/' + roleId,
    method: 'get'
  })
}

export function grantRoleMenu(roleId, menuIds) {
  return request({
    url: '/system/role/grant',
    method: 'post',
    data: {
      roleId, menuIds
    }
  })
}

export function delRole(ids) {
  return request({
    url: '/system/role/',
    method: 'delete',
    data: ids
  })
}

export function exportExcelRole(query, fileName) {
  exportExcelUtil('/system/role/export', fileName, query)
}

// 通过枚举获取字典值
export function getRoleDictsByEnum(code) {
  return request({
    url: '/system/role/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}

export function changeRoleStatus(id, status) {
  const data = {
    id: id,
    status: status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}
