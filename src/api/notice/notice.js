import request from '@/utils/request'

// 分页
export function listSysNotice(query) {
  return request({
    url: '/notice/page',
    method: 'get',
    params: query
  })
}
// 分页
export function listSysNoticeWithReceiver(query) {
  return request({
    url: '/notice/pageWithMe',
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
export function delSysNotice(id) {
  return request({
    url: '/notice/' + id,
    method: 'delete'
  })
}

// 发布
export function publishSysNotice(id) {
  return request({
    url: '/notice/publish/' + id,
    method: 'put'
  })
}

// 撤销
export function revokeSysNotice(id) {
  return request({
    url: '/notice/revoke/' + id,
    method: 'put'
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
