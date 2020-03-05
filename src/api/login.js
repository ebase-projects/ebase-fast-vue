import request from '@/utils/request'

/**
 * 获取验证码（弃用）
 * @param deviceId
 * @returns {AxiosPromise}
 */
export function getImgCode(deviceId) {
  return request({
    url: 'code/image',
    method: 'get',
    params: {
      deviceId: deviceId
    }
  })
}

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param deviceId 设备ID，终端自动生成的
 * @returns {AxiosPromise}
 */
export function sendSms(phone, deviceId) {
  const data = {
    mobile: phone,
    deviceId
  }
  return request({
    url: 'code/sms',
    method: 'get',
    params: data
  })
}

/**
 * 根据手机登陆
 * @param phone 手机号
 * @param smsCode 短信验证码
 * @param deviceId 设备ID，终端自动生成的
 * @returns {AxiosPromise}
 */
export function loginByUserPhone(phone, smsCode, deviceId) {
  const data = {
    mobile: phone,
    smsCode,
    deviceId
  }
  // 登录
  return request({
    url: '/auth/mobile',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YXBwOmFwcA=='
    },
    params: data
  })
}

/**
 * 根据用户名登陆
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param deviceId 设备ID，终端自动生成的
 * @returns {AxiosPromise}
 */
export function loginByUsername(username, password, code, deviceId) {
  const grant_type = 'password'
  // https://github.com/axios/axios#browser
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  params.append('grant_type', grant_type)
  params.append('scope', 'server')
  params.append('imageCode', code)
  params.append('deviceId', deviceId)
  // 登录
  return request({
    url: '/oauth/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YXBwOmFwcA=='
    },
    data: params
  })
}

/**
 * 退出登录
 * @returns {AxiosPromise}
 */
export function logout() {
  return request({
    url: '/oauth/logout',
    method: 'post'
  })
}
