import request from '@/utils/request'

export function loginByUsername(username, password, code, token, key) {
  // const data = {
  //   username,
  //   password,
  //   grant_type: 'password',
  //   scope: 'server'
  // }

  const grant_type = 'password'
  // https://github.com/axios/axios#browser
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  // params.append('randomStr', randomStr)
  params.append('code', code)
  params.append('grant_type', grant_type)
  params.append('scope', 'server')
  // 登录
  return request({
    url: '/oauth/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YXBwOmFwcA=='
    },
    // auth: {
    //   username: 'app',
    //   password: 'app'
    // },
    // transformRequest: [function(data) {
    // // Do whatever you want to transform the data
    //   let ret = ''
    //   for (const it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }],
    data: params
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

export function getImgCode() {
  return request({
    url: 'code/image' + '?deviceId=1',
    // url: '/system/dept/155111',
    method: 'get'
  })
}

// 根据手机
export function loginByUserPhone(phone, smsCode) {
  const data = {
    phone,
    smsCode
  }
  // 登录
  return request({
    url: '/mobile/login',
    method: 'post',
    params: data
  })
}

