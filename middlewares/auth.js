const basicAuth = require('basic-auth') // 解析 token
const jwt = require('jsonwebtoken') // 令牌
const { Forbbiden } = require('../core/http-exception') // 禁止访问 - 异常

// token令牌通过 HTTP Basic Auth传递

// 检测 token令牌 - 中间件
class Auth {
  constructor(level) { // level: API级别
    // 用户权限大于 API级别 => 有权访问该API接口
    this.level = level || 1 // API接口级别
    // 用户权限
    Auth.USER = 8 // 普通用户
    Auth.ADMIN = 16 // 管理员
  }

  // 校验token令牌 - 中间件
  get m() {
    return async (ctx, next) => {
      // 获取用户Token
      const userToken = basicAuth(ctx.req) // ctx.req: koa封装的 node.js request
      // userToken不存在，拒绝访问
      if(!userToken || !userToken.name) {
        throw new Forbbiden()
      }
      try {
        // 返回携带的参数 uid, scope
        var decode = jwt.verify(userToken.name, global.config.security.secretKey) // 校验令牌
      } catch (error) {
        // 用户令牌不合法
        if(error.name === 'TokenExpiredError') { // Token过期
          throw new Forbbiden('Token令牌已过期')
        }
        throw new Forbbiden('Token不合法')
      }
      // 用户权限小于API权限
      if(decode.scope < this.level) {
        throw new Forbbiden('权限不足')
      }

      // 保存用户 uid, scope
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      await next() // 执行下一个中间件
    }
  }

  // 验证令牌是否有效
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey) // 校验令牌
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}