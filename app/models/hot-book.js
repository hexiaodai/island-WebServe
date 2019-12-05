const { Sequelize, Model, Op } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db') // Model
const { Favor } = require('./favor') // favor模型

// 热门书籍模型
class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: [
        'index'
      ]
    })
    const ids = [] // 热门书籍id号
    books.forEach(book => {
      ids.push(book.id)
    })
    const favors = await Favor.findAll({
      where: {
        artId: {
          [Op.in]: ids
        },
        type: 400
      },
      // 对数据进行分组
      group: ['artId'], // 根据artId分组
      // Sequelize.fn('COUNT'): 分组求和, count:别名
      attributes: ['artId', [Sequelize.fn('COUNT', '*'), 'count']] // 查询的数据
    })
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    })
    return books
  }

  // favors表artId对应 hot_book表id
  static _getEachBookStatus(book, favors) {
    let count = 0
    favors.forEach(favor => {
      if(book.id === favors.artId) {
        count = favor.count
      }
    })
    book.setDataValue('count', count)
    return book
  }
}

HotBook.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 主键自增长
  },
  index: Sequelize.INTEGER, // 排序
  image: Sequelize.STRING, // 图书封面图
  author: Sequelize.STRING, // 作者
  title: Sequelize.STRING, // 图书名称
  status: { // 状态
    type: Sequelize.SMALLINT,
    defaultValue: 1
  }
}, {
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  HotBook
}