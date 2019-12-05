/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:36:02
 * @LastEditTime: 2019-08-09 11:39:40
 * @LastEditors: Please set LastEditors
 */
// 自定义HttpException错误异常类 - 继承nodejs Error对象
class HttpException extends Error {
  // 构造函数，定义错误属性
  constructor(msg='「何小呆」去搭乘404航班去诗和远方了', errorCode=10000, code=400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

// 处理成功
class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 201 // 查询成功
    this.msg = msg || 'OK'
    this.errorCode = errorCode || 0
  }
}

// 资源不存在
class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '资源未找到'
    this.errorCode = errorCode || 10000
    this.code = 404
  }
}

// 验证失败
class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
    this.code = 401
  }
}

// 拒绝访问
class Forbbiden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
    this.code = 403
  }
}

// 已经收藏过
class LikeError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '你已经点过赞'
    this.errorCode = errorCode || 60001
  }
}

// 已经取消收藏
class DislikeError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '你已经取消点赞'
    this.errorCode = errorCode || 60002
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError
}