const { Sequelize, Model } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db') // Model

class Comment extends Model {
  // 新增短评 - 点赞
  static async addComment(bookId, myContent) { // 书籍id, 短评
    // 查询数据库是否存在该短评
    const comment = await Comment.findOne({
      where: {
        content: myContent
      }
    })
    if(comment) {
      // 评论 +1
      return await comment.increment('nums', { by: 1 }) // 评论 +1
    } else {
      // 新增评论
      return await Comment.create({
        bookId,
        content: myContent,
        nums: 1
      })
    }
  }

  // 获取书籍短评 - 书籍id
  static async getComments(bookId) {
    const comments = await Comment.findAll({
      where: {
        bookId
      }
    })
    return comments
  }

  // toJSON 自定义Model返回的数据 - 自定义JSON序列化方式
  // toJSON() {
  //   return {
  //     // 最终返回的json数据
  //     // this.getDataValue(): 获取所有序列化的字段
  //     id: this.getDataValue('id'), // this.getDataValue('id') 查询结果的 id
  //     bookId: this.getDataValue('bookId'),
  //     content: this.getDataValue('content'),
  //     nums: this.getDataValue('nums')
  //   }
  // }
}

Comment.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 主键自增长
  },
  bookId: Sequelize.INTEGER,
  content: Sequelize.STRING, // 短评内容
  nums: { // 短评 +1
    type: Sequelize.INTEGER,
    defaultValue: 0 // 默认值
  }
}, {
  sequelize,
  tableName: 'comment'
})

module.exports = {
  Comment
}