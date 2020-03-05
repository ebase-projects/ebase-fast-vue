import request from '@/utils/request'

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

// 登出
export function logout() {
  return request({
    url: '/oauth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}
export function getImgCode(deviceId) {
  return request({
    url: 'code/image',
    method: 'get',
    params: {
      deviceId: deviceId
    }
  })
}

// 发送短信验证码
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

// 根据手机登陆
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
