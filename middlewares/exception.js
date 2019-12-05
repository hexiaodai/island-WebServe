const { HttpException } = require('../core/http-exception')

// 全局异常处理 - 中间件
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 开发环境 直接抛出异常
    const isHttpException = error instanceof HttpException // 判断异常是否为 HttpException
    const isDev = global.config.environment === 'dev' // 判断是否为 开发模式
    if(isDev && !isHttpException) {
      throw error
    }
    // 已知异常
    if(isHttpException) {
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code // 设置http状态码
    }else {
      // 未知异常
      ctx.body = {
        msg: '「何小呆」去搭乘404航班去诗和远方了',
        errorCode: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500 // 设置http状态码
    }
  }
}

module.exports = {
  catchError
}