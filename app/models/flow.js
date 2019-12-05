const { Sequelize, Model } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db') // Model

// 业务表
class Flow extends Model {

}
Flow.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 主键自增长
  },
  index: Sequelize.INTEGER, // 期刊序号
  artId: Sequelize.INTEGER, // 实体表 id (对应Movie, Music, Sentence模型id)
  type: Sequelize.INTEGER, // type:100 Movie表; type:200 Music表; type:300 Sentence表
  // art_id、type组合：确定唯一一个实体模型
  status: { // 状态
    type: Sequelize.SMALLINT,
    defaultValue: 1
  }
}, {
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}