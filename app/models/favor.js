const { Sequelize, Model, Op } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db') // Model
const { Art } = require('./art') // art模型

// 记录用户是否收藏某一期刊 - 业务表
class Favor extends Model {
  // 收藏
  static async like(artId, type, uid) {
    // 修改 favor, classic表 - 添加favor一条数据, 添加classic fav_nums + 1
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    // 已经收藏过
    if(favor) {
      throw new global.errs.LikeError()
    }
    // 执行事务 (执行完毕后一定要 return)
    return await sequelize.transaction(async t => {
      // 往favor表插入记录
      Favor.create({
        artId,
        type,
        uid
      }, {transaction: t}) // transaction: t 保持事务
      // classic表（期刊）fav_nums + 1
      const art = await Art.getData(artId, type) // 获取具体期刊表
      await art.increment('favNums', {by: 1, transaction: t}) // increment()：字段fav_nums 加 1
    })
  }

  // 取消收藏
  static async dislike(artId, type, uid) {
    // 修改 favor, classic表 - 删除favor一条数据, 添加classic fav_nums - 1
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    // 未收藏
    if(!favor) {
      throw new global.errs.DislikeError()
    }
    // 执行事务 (执行完毕后一定要 return)
    return await sequelize.transaction(async t => {
      // 删除当前favor表记录
      favor.destroy({
        force: false, // 软删除
        transaction: t
      }) // transaction: t 保持事务
      // classic表（期刊）fav_nums + 1
      const art = await Art.getData(artId, type) // 获取具体期刊表
      await art.decrement('favNums', {by: 1, transaction: t}) // decrement()：字段fav_nums - 1
    })
  }

  // 用户对期刊是否点赞
  static async userLikeIt(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        artId,
        type,
      }
    })
    return favor ? true : false
  }

  // 用户点赞的所有期刊 - 不包括书籍
  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: { // type != 400, 400表示书籍
          [Op.not]: 400 // sequelize提供的操作符 Op.not:是一个表达式 表示type!=400
        }
      }
    })
    if(!arts) {
      throw new global.errs.NotFound()
    }
    // 根据 artId查询实体表查询数据 - artId是数组
    return await Art.gteList(arts)
  }

  // 获取书籍点赞信息
  static async getBookFavor(bookId, uid) { // bookId: 书籍id号
    // 书籍点赞信息
    const favorNums = await Favor.count({
      where: {
        artId: bookId,
        type: 400
      }
    })
    // 用户是否对该书籍点赞
    const myFavor = await Favor.findOne({
      where: {
        artId: bookId,
        uid,
        type: 400
      }
    })
    return {
      favNums: favorNums,
      likeStatus: myFavor ? 1 : 0 // 1喜欢 0不喜欢
    }
  }
}

Favor.init({
  uid: Sequelize.INTEGER, // 用户id
  artId: Sequelize.INTEGER, // 实体表 id (对应Movie, Music, Sentence模型id)
  type: Sequelize.INTEGER // 类型（music:100, sentence:200, movie:300）
}, {
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}
