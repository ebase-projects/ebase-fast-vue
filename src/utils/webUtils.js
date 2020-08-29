import qs from 'qs'
import uuid from '@/utils/uuid'

/**
 * WebUtil常用的一些工具类
 */

export function formatData(arr) {
  const params = new URLSearchParams()
  for (const key in arr) {
    if (!arr[key] && arr[key] !== undefined) {
      params.append(key, arr[key])
    }
  }
  // console.log(params)
  return params
}

/**
 * 对象序列化成URL的形式，以&进行拼接
 * @param data
 * @returns {*}
 */
export function parseObject2UrlParam(data) {
  return qs.stringify(data)
}

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * @returns {string}
 */
export const parseJson2Url = function(param, key) {
  let paramStr = ''
  const mappingOperator = '='
  const separator = '&'
  if (param instanceof String || typeof (param) === 'string' ||
    param instanceof Number || typeof (param) === 'number' ||
    param instanceof Boolean || typeof (param) === 'boolean') {
    paramStr += separator + key + mappingOperator + encodeURIComponent(param)
  } else {
    for (const i in param) {
      const value = param[i]
      if (value !== '' && value !== undefined) {
        const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += separator + parseJson2Url(value, k)
      }
    }
  }
  return paramStr.substr(1)
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
    // console.log('"' + key + '"', arr[key])
    params.append('"' + key + '"', arr[key])
  }
  return params
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

