import request from '@/utils/request'

// 分页
export function listSysNotice(query) {
  return request({
    url: '/notice/page',
    method: 'get',
    params: query
  })
}

// 新增
export function addSysNotice(form) {
  return request({
    url: 'notice',
    method: 'post',
    data: form
  })
}

// 更新
export function updateSysNotice(form) {
  return request({
    url: '/notice',
    method: 'put',
    data: form
  })
}

// 获取单条数据
export function getSysNotice(id) {
  return request({
    url: '/notice/' + id,
    method: 'get'
  })
}

// 删除
export function delSysNotice(ids) {
  return request({
    url: '/notice',
    method: 'delete',
    data: ids
  })
}

// 通过枚举获取字典值
export function getNoticeDictsByEnum(code) {
  return request({
    url: '/notice/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}
