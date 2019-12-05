/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:22:40
 * @LastEditTime: 2019-08-09 15:36:13
 * @LastEditors: Please set LastEditors
 */
// 验证 val是否存在于 LoginType中
function isThisType(val) {
  for(let key in this) {
    if(this[key] === val) {
      return true
    }
  }
  return false
}

// 模拟枚举 - 登陆类型
const LoginType = {
  USER_MINI_PROGRAM: 100, // 小程序登陆
  USER_EMAIL: 101, // email登陆
  USER_MOBILE: 102, // 手机号登陆
  ADMIN_EMAIL: 200, // 管理员email登陆
  isThisType // 验证 val是否存在于 LoginType中
}

// 模拟枚举 - API权限
const APIAccess = {
  USER: 1,
  ADMIN: 9
}

// 期刊类型
const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType
}

module.exports = {
  LoginType,
  APIAccess,
  ArtType
}