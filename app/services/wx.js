/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 15:44:08
 * @LastEditTime: 2019-08-09 18:21:41
 * @LastEditors: Please set LastEditors
 */
const util = require('util') // 工具
const axios = require('axios')
const { User } = require('../models/user') // 用户模型
const { generateToken } = require('../../core/util') // 登陆令牌
const { Auth } = require('../../middlewares/auth')

// 处理微信小程序逻辑
class WXManager {
  // 小程序Token令牌
  static async codeToken(code) { // code - 微信小程序提供
    // openid 微信服务提供 小程序唯一标识
    // 验证小程序登陆是否合法需要：code, appid(微信小程序开发者), appsecret(微信小程序开发者)
    const wxConfig = global.config.wx // 微信登陆参数
    // 格式化 微信loginUrl
    const url = util.format(wxConfig.loginUrl, wxConfig.appID, wxConfig.appSecret, code) // format():格式化字符串
    // const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxcae4528862a54e99&secret=7d07469e97be0ae254e68adc9fbf58fd&js_code=%s&grant_type=authorization_code'
    // 调用微信登陆服务
    const result = await axios.get(url) // 其中返回openid
    if(result.status !== 200) {
      throw new global.errs.AuthFailed('openid获取失败') // 验证失败
    }
    const errcode = result.data.errcode
    const errormsg = result.data.errmsg
    if(errcode) { // 若errcode存在 - 不合法
      throw new global.errs.AuthFailed('openid获取失败:' + errormsg) // 验证失败
    }
    // openid正确逻辑
    let user = await User.getUserByOpenid(result.data.openid) // 查询数据库是否存在该 openid
    if(!user) {
      // 用户openid存入数据库
      user = await User.registerByOpenid(result.data.openid)
    }
    // 生成 Token令牌
    return generateToken(user.id, Auth.USER) // 用户id, 用户权限
  }
}

module.exports = {
  WXManager
}