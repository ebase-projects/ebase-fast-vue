import request from '@/utils/request'

// 分页
export function listSysNoticeUser(query) {
  return request({
    url: '/notice/noticeUser/page/',
    method: 'get',
    params: query
  })
}

// 新增
export function addSysNoticeUser(form) {
  return request({
    url: '/notice/noticeUser/',
    method: 'post',
    data: form
  })
}

// 更新
export function updateSysNoticeUser(form) {
  return request({
    url: '/notice/noticeUser/',
    method: 'put',
    data: form
  })
}

// 获取单条数据
export function getSysNoticeUser(id) {
  return request({
    url: '/notice/noticeUser/' + id,
    method: 'get'
  })
}

// 删除
export function delSysNoticeUser(ids) {
  return request({
    url: '/notice/noticeUser/',
    method: 'delete',
    data: ids
  })
}
