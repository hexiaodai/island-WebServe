// 帮助函数
const { Success } = require('../../core/http-exception')

// 处理成功 “异常”
function success(msg, errorCode) {
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}