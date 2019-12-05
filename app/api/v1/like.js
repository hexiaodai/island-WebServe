// 期刊收藏
const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { APIAccess } = require('../../lib/enum') // API权限级别 - 取值
const { LikeValidator } = require('../../validators/validator') // 校验器
const { Favor } = require('../../models/favor') // favor模型
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/like'
})

// 点赞
router.post('/', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    // 给artId设置别名，validate()检测的字段是 id，不是artId
    id: 'artId'
  })
  await Favor.like(v.get('body.artId'), v.get('body.type'), ctx.auth.uid) // ctx.auth.uid: 登陆后ctx.auth上存放uid
  success()
})

// 取消点赞
router.post('/cancel', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    // 给artId设置别名，validate()检测的字段是 id，不是artId
    id: 'artId'
  })
  await Favor.dislike(v.get('body.artId'), v.get('body.type'), ctx.auth.uid) // ctx.auth.uid: 登陆后ctx.auth上存放uid
  success()
})

module.exports = {
  router
}
