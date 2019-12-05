// 查询逻辑
const { Op } = require('sequelize') // 数据库工具模块
const { flatten } = require('lodash') // 很多好用的函数, flatten: 二维数组转一维数组
const { Movie, Sentence, Music } = require('./classic')

class Art {
  constructor(artId, type) {
    this.artId = artId,
    this.type = type
  }

  // 根据artId，type查询数据 获取具体期刊实体表数据
  static async getData(artId, type) {
    let art = null
    const finder = {
      where: {
        id: artId // artId:实体表 id (对应Movie, Music, Sentence模型id)
      }
    }
    switch(type) {
      case 100: { // movie表
        art = await Movie.findOne(finder)
        break
      }
      case 200: { // music表
        art = await Music.findOne(finder)
        break
      }
      case 300: { // sentence表
        art = await Sentence.findOne(finder)
        break
      }
      case 400: { // book表
        const { Book } = require('./book')
        art = await Book.findOne(finder)
        if(!art) {
          await Book.create({
            id: artId,
          })
        }
        break
      }
      default: {
        break
      }
    }
    return art
  }

  // 获取详细期刊详细
  async getDetail(uid) {
    const { Favor } = require('./favor') // 避免循环引用
    const art = await Art.getData(this.artId, this.type)
    if (!art) {
      throw new global.errs.NotFound()
    }
    const like = await Favor.userLikeIt(this.artId, this.type, uid)
    return {
      art,
      likeStatus: like
    }
  }

  // 获取一组期刊
  static async gteList(artinfoList) {
    const arts = [] // 保存查询结果
    // 3种 art类型(Movie Sentence Music)
    const artInfoObj = {
      100: [], // type == 100的id号
      200: [], // type == 200的id号
      300: [] // type == 300的id号
    }
    // 对type进行分类
    for(let artInfo of artinfoList) {
      artInfoObj[artInfo.type].push(artInfo.artId) // artInfoObj[100].push(artInfo.id)
    }
    // 查询数据库
    for(let key in artInfoObj) {
      const ids = artInfoObj[key]
      if(ids.length === 0) {
        continue
      }
      // artInfoObj[key]:表示 ids, key: 表示type
      const res = await Art._getListByType(ids, parseInt(key))
      arts.push(res)
    }
    return flatten(arts) // arts二维数组, flatten(): 二维数组转成一维数组
  }

  // 根据type获取一组classic 数据
  static async _getListByType(ids, type) {
    let arts = []
    const finder = { // Movie, Music, Sentence模型id
      where: {
        id: {
          [Op.in]: ids // [Op.in]: in查询
        }
      }
    }
    switch(type) {
      case 100: { // movie表
        arts = await Movie.findAll(finder)
        break
      }
      case 200: { // music表
        arts = await Music.findAll(finder)
        break
      }
      case 300: { // sentence表
        arts = await Sentence.findAll(finder)
        break
      }
      case 400: { // book表
        break
      }
      default: {
        break
      }
    }
    return arts // Array
  }
}

module.exports = {
  Art
}