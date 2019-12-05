const Router = require('koa-router') // 导入koa-router
const { Op } = require('sequelize') // 数据库工具模块
const { PositiveIntegerValidator, ClassicValidator } = require('../../validators/validator') // 校验器
const { Auth } = require('../../../middlewares/auth') // 解析 token
const { APIAccess } = require('../../lib/enum') // API权限级别 - 取值
const { Flow } = require('../../models/flow') // Flow模型
const { Favor } = require('../../models/favor') // favor模型
const { Art } = require('../../models/art') // 查询逻辑

const router = new Router({
  prefix: '/v1/classic'
})

// 查询最新一期的期刊 - 去除音乐
router.get('/latestNoMusic', new Auth(APIAccess.USER).m, async (ctx) => {
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ],
    where: {
      type: {
        [Op.not]: 200
      }
    }
  })
  // (Movie, Sentence表数据)
  const art = await Art.getData(flow.artId, flow.type)
  // 判断当前用户是否点赞该期刊
  const isLike = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid) 
  // art.dataValues.index = flow.index // 给art.dataValues添加 index属性
  art.setDataValue('index', flow.index) // 给art.dataValues添加 index属性
  art.setDataValue('likeStatus', isLike)
  // 最终返回 art.dataValues内的JSON数据
  ctx.body = {
    art
  }
})

// 功能：查询最新一期的期刊
// new Auth(APIAccess.USER).m: 校验令牌 - 中间件，APIAccess.USER: API权限级别
router.get('/latest', new Auth(APIAccess.USER).m, async (ctx) => {
  // flow表数据
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC'] // 根据index倒序排序
    ]
  })
  // (Movie, Music, Sentence表数据)
  const art = await Art.getData(flow.artId, flow.type)
  // 判断当前用户是否点赞该期刊
  const isLike = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid) 
  // art.dataValues.index = flow.index // 给art.dataValues添加 index属性
  art.setDataValue('index', flow.index) // 给art.dataValues添加 index属性
  art.setDataValue('likeStatus', isLike)
  // 最终返回 art.dataValues内的JSON数据
  ctx.body = {
    art
  }
})

// 下一期期刊
// index期刊编号
router.get('/:index/next', new Auth(APIAccess.USER).m, async (ctx) => {
  const index = Number(ctx.params.index) + 1// 下一期期刊编号
  const art = await getClassic(ctx, index) // 下一期期刊
  ctx.body = art
})

// 上一期期刊
// index期刊编号
router.get('/:index/previous', new Auth(APIAccess.USER).m, async (ctx) => {
  const index = Number(ctx.params.index) - 1 // 上一期期刊编号
  const art = await getClassic(ctx, index) // 上一期期刊
  ctx.body = art
})

// 获取某一期期刊详细信息
// type:期刊类型, id:期刊id
router.get('/:type/:id', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  // 别删这段代码
  // artDetail.art.setDataValue('likeStatus', artDetail.likeStatus)
  // ctx.body = artDetail.art
  ctx.body = {
    art: artDetail.art,
    likeStatus: artDetail.likeStatus
  }
})

// 获取期刊点赞信息
// type:期刊类型, id:期刊id
router.get('/:type/:id/favor', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type) // 获取期刊点赞数量
  const isLike = await Favor.userLikeIt(id, type, ctx.auth.uid) // 判断当前用户是否点赞该期刊
  if(!art) {
    throw new global.errs.NotFound()
  }
  ctx.body = {
    favNums: art.favNums,
    likeStatus: isLike
  }
})

// 用户喜欢的所有期刊列表
router.get('/favor', new Auth(APIAccess.USER).m, async (ctx) => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyClassicFavors(uid)
})


// 获取期刊详细信息
async function getClassic(ctx, index) { // index: 期刊编号
  // 校验参数
  await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  // 期刊
  const flow = await Flow.findOne({
    where: {
      index
    }
  })
  if(!flow) {
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.artId, flow.type)
  // 是否喜欢该期刊
  const isLike = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index) // 附加期刊号
  art.setDataValue('likeStatus', isLike) // 附加点赞信息
  return art
}

// 获取期刊详细信息 - 去除Music
// async function getClassicNoMusic(ctx, index) { // index: 期刊编号
//   // 校验参数
//   await new PositiveIntegerValidator().validate(ctx, {
//     id: 'index'
//   })
//   // 期刊
//   const flow = await Flow.findOne({
//     where: {
//       index,
//       type: {
//         [Op.not]: 200
//       }
//     }
//   })
//   if(!flow) {
//     throw new global.errs.NotFound()
//   }
//   const art = await Art.getData(flow.artId, flow.type)
//   // 是否喜欢该期刊
//   const isLike = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
//   art.setDataValue('index', flow.index) // 附加期刊号
//   art.setDataValue('likeStatus', isLike) // 附加点赞信息
//   return art
// }


module.exports = {
  router
}