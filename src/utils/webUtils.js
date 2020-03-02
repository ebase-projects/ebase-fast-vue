import qs from 'qs'
import uuid from '@/utils/uuid'

/**
 * WebUtil常用的一些工具类
 */

export function formatData(arr) {
  const params = new URLSearchParams()
  for (const key in arr) {
    params.append(key, arr[key])
  }
  return params
}

export function formatDataToJson(arr) {
  var params = '['
  for (var key in arr) {
    params = params + key + ':' + arr[key] + ','
  }
  params += ']'
  return params
}

export function formatDataToForm(arr) {
  const params = new FormData()
  for (var key in arr) {
    console.log('"' + key + '"', arr[key])
    params.append('"' + key + '"', arr[key])
  }
  return params
}

export function getPar(data) {
  return qs.stringify(data)
}

export function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[1].replace(/\+/g, '%20')) || null
}

export function getDeviceId(name) {
  // 获取唯一标识号
  const deviceName = name || 'deviceId'

  // if (!localStorage.getItem(deviceName)) {
  const timestamp = new Date().getTime()
  // 获取第16位到32位
  const deviceId = '' + uuid.uuid(16, 32) + timestamp
  localStorage.setItem(deviceName, deviceId)
  return deviceId
  // }
}

