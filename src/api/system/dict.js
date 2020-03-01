import request from '@/utils/request'

export function listDict(query) {
  return request({
    url: '/system/dict/page',
    method: 'get',
    params: query
  })
}

export function addDict(form) {
  return request({
    url: '/system/dict',
    method: 'post',
    data: form
  })
}

export function updateDict(form) {
  return request({
    url: '/system/dict',
    method: 'put',
    data: form
  })
}

export function getDict(id) {
  return request({
    url: '/system/dict/' + id,
    method: 'get'
  })
}

export function delDict(ids) {
  return request({
    url: '/system/dict/',
    method: 'delete',
    data: ids
  })
}

export function listDictItem(query) {
  return request({
    url: '/system/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addDictItem(form) {
  return request({
    url: '/system/dict/item',
    method: 'post',
    data: form
  })
}

export function updateDictItem(form) {
  return request({
    url: '/system/dict/item',
    method: 'put',
    data: form
  })
}

export function getDictItem(id) {
  return request({
    url: '/system/dict/item/' + id,
    method: 'get'
  })
}

export function delDictItem(ids) {
  return request({
    url: '/system/dict/item',
    method: 'delete',
    data: ids
  })
}

