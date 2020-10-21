import request from '@/utils/request'

// 分页
export function listSysNoticeReceiver(query) {
  return request({
    url: '/notice/noticeReceiver/page',
    method: 'get',
    params: query
  })
}

// 已读
export function noticeUserReaded(id) {
  return request({
    url: '/notice/noticeReceiver/readed/' + id,
    method: 'put'
  })
}
