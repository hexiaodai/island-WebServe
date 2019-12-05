// 创建数据表
const { Sequelize, Model } = require('sequelize') // 数据库工具模块
const { unset, clone } = require('lodash') // unset(): 删除对象上的属性

const db = global.config.database

const sequelize = new Sequelize(db.dbName, db.user, db.password, {
  dialect: 'mysql', // 数据库类型
  host: db.host,
  port: db.port,
  timezone: '+08:00', // 时区 - 北京时间
  logging: true, // 在终端显示数据库操作
  define: {
    timestamps: true, // 创建日期字段
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
})

sequelize.sync({
  force: false // 更新数据表字段
})


// 自定义序列化 Model
Model.prototype.toJSON = function() {
  // 去除所有序列化Model时，Model上的时间字段
  let data = clone(this.dataValues) // 浅拷贝data，获取Model序列化的所有字段

  // 给图片资源添加网站目录前缀  
  for(key in data) {
    if(key === 'image' && !data[key].startsWith('http')) {
      data[key] = global.config.host + data[key]
    }
  }

  // 删除 created_at, deleted_at字段
  unset(data, 'created_at')
  unset(data, 'deleted_at')
  return data
}

module.exports = {
  sequelize
}