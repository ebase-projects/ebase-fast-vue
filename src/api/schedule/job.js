import request from '@/utils/request'

export function listSchedule(query) {
  return request({
    url: '/schedule/page',
    method: 'get',
    params: query
  })
}
export function listAllSchedule(query) {
  return request({
    url: '/schedule',
    method: 'get',
    params: query
  })
}

export function addSchedule(form) {
  return request({
    url: '/schedule',
    method: 'post',
    data: form
  })
}

export function updateSchedule(form) {
  return request({
    url: '/schedule',
    method: 'put',
    data: form
  })
}

export function getSchedule(id) {
  return request({
    url: '/schedule/' + id,
    method: 'get'
  })
}

// 删除
export function delSchedule(ids) {
  return request({
    url: '/schedule',
    method: 'delete',
    data: ids
  })
}
// 暂停
export function pauseSchedule(ids) {
  return request({
    url: '/schedule/pause',
    method: 'put',
    data: ids
  })
}
// 恢复
export function resumeSchedule(ids) {
  return request({
    url: '/schedule/resume',
    method: 'put',
    data: ids
  })
}
// 执行
export function runSchedule(ids) {
  return request({
    url: '/schedule/run',
    method: 'put',
    data: ids
  })
}

// 通过枚举获取字典值
export function getScheduleDictsByEnum(code) {
  return request({
    url: '/schedule/getDicByList',
    method: 'get',
    params: {
      enumName: code
    }
  })
}

export function changeScheduleStatus(id, status) {
  const data = {
    id: id,
    status: status
  }
  return request({
    url: '/schedule/changeStatus',
    method: 'put',
    data: data
  })
}
