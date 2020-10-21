import request from '@/utils/request'

// 分页
export function listSysNoticeUser(query) {
  return request({
    url: '/notice/noticeUser/page/',
    method: 'get',
    params: query
  })
}

// 已读
export function noticeUserReaded(id) {
  return request({
    url: '/notice/noticeUser/readed/' + id,
    method: 'put'
  })
}
