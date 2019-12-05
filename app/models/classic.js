const { Sequelize, Model } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db') // Model
 
// music, sentence, movie => classic
// 公共字段
const classicFields = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 主键自增长
  },
  image: {
    type: Sequelize.STRING, // 图片
    // 获取模型时，字段执行get()
    // 给图片资源添加网站目录前缀
    // get() {
    //   // this.getDataValue('image'): 获取模型上的image属性
    //   return global.config.host + this.getDataValue('image')
    // }
  },
  content: Sequelize.STRING, // 内容
  pubdate: Sequelize.DATEONLY, // 发布日期
  favNums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }, // 收藏数量
  title: Sequelize.STRING, // 标题
  type: Sequelize.INTEGER, // 类型（music:100, sentence:200, movie:300）
  status: { // 状态
    type: Sequelize.SMALLINT,
    defaultValue: 1
  }
}

// Movie模型（电影表）
class Movie extends Model {

}
Movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})

// Sentence模型（句子表）
class Sentence extends Model {

}
Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})

// Music模型（音乐表）
class Music extends Model {

}
Music.init(Object.assign({ // Object.assign() 合并两个对象
  url: Sequelize.STRING
}, classicFields), {
  sequelize,
  tableName: 'music'
})

module.exports = {
  Movie,
  Sentence,
  Music
}