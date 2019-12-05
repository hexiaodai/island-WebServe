const { Sequelize, Model, Op } = require('sequelize') // 数据库工具模块
const util = require('util') // 工具
const axios = require('axios')
const { sequelize } = require('../../core/db') // Model
const { Favor } = require('./favor') // favor模型

class Book extends Model {
  // 获取书籍详细信息
  static async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id) // 书籍详情url
    const detail = await axios.get(url)
    return detail.data
  }

  // 搜索书籍
  // q: 搜索关键字，start: 开始编号，summary=1: 搜索概要信息
  static async searchFromYuShu(q, start, count, summary=1){
    // encodeURI(): 对搜索关键字进行编码
    const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const res = await axios.get(url)
    return res.data
  }
  
  // 获取我喜欢的书籍数量
  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid
      }
    })
    return count
  }
}

Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
  },
  favNums: {
    type: Sequelize.INTEGER,
    defaultValue: 0 // 默认值
  }
}, {
  sequelize,
  tableName: 'book'
})

module.exports = {
  Book
}