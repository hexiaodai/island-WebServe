/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 13:37:23
 * @LastEditTime: 2019-08-09 16:42:45
 * @LastEditors: Please set LastEditors
 */
const bcrypt = require('bcryptjs') // 密码加密
const { Sequelize, Model } = require('sequelize') // 数据库工具模块
const { sequelize } = require('../../core/db')
const { AuthFailed } = require('../../core/http-exception')

// 定义模型
class User extends Model {
  /**
   * @description: email登陆
   * @param {String} email
   * @param {String} plainPassword 密码
   * @return: 用户信息
   */
  static async verifyEmailPassword(email, plainPassword) {
    const user = await this.findOne({
      where: {
        email
      }
    })
    if(!user) {
      throw new AuthFailed('用户不存在')
    }
    // 验证密码是否一致
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if(!correct) {
      throw new AuthFailed('密码不正确')
    }
    return user
  }

  /**
   * @description: 获取微信小程序openid - 微信登陆
   * @param {String} openid 
   * @return: 用户信息
   */  
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }

  /**
   * @description: 根据 openid创建微信用户
   * @param {String} 
   * @return: openid
   */
  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}

User.init({
  // 属性: 类型
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 主键自增长
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set(val) { // Model属性操作
      const salt = bcrypt.genSaltSync(10) // 生成盐值
      // 抵御 彩虹攻击
      const pwd = bcrypt.hashSync(val, salt) // 生成加密密码
      this.setDataValue('password', pwd) // 将加密的密码赋值给password 存入数据库
    }
  },
  openid: { // 微信用户id
    type: Sequelize.STRING(64),
    unique: true // 唯一标识
  },
  status: { // 状态
    type: Sequelize.SMALLINT,
    defaultValue: 1
  }
}, {
  sequelize,
  tableName: 'user'
})

module.exports = {
  User
}