// 用户登陆
const Router = require('koa-router') // 导入koa-router
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum') // 用户登陆类型
const { User } = require('../../models/user') // User模型
const { ParameterException } = require('../../../core/http-exception')
const { generateToken } = require('../../../core/util') // 用户登陆令牌
const { Auth } = require('../../../middlewares/auth') // 检测token令牌
const { WXManager } = require('../../services/wx') // 微信小程序登陆

const router = new Router({
  prefix: '/v1/token' // url路由前缀
})

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx) // 校验参数
  let token // 存放登陆令牌
  // 根据type验证登陆类型
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL: { // email登陆
      token = await emailLogin(v.get('body.account'), v.get('body.secret'))
      break
    }
    // 微信小程序登陆
    case LoginType.USER_MINI_PROGRAM: {
      token = await WXManager.codeToken(v.get('body.account')) // 参数：微信小程序 code
      break
    }
    // 管理员登陆
    case LoginType.ADMIN_EMAIL: {

      break
    }
    default: {
      throw new ParameterException('没有相应的处理函数')
    }
  }
  // 返回客户端登陆令牌
  ctx.body = {
    token
  }
})

// 验证token是否有效
router.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx) // 校验参数
  const result = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    isValid: result
  }
})

/**
 * @description: email登陆具体逻辑
 * @param {String} account 账号
 * @param {String}  secret 密码
 * @return: 
 */
async function emailLogin(account, secret) {
  // 根据 account 查询数据库，判断是否与 secret符合
  const user = await User.verifyEmailPassword(account, secret)
  // user.id: 用户id, Auth.USER: 用户权限
  return generateToken(user.id, Auth.USER) // 生成令牌
}

module.exports = {
  router
}