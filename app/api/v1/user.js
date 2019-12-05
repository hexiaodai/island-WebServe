/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 15:14:57
 * @LastEditTime: 2019-08-09 16:31:25
 * @LastEditors: Please set LastEditors
 */
const Router = require('koa-router') // 导入koa-router
const { RegisterValidator } = require('../../validators/validator') // 校验器
const { success } = require('../../lib/helper')
const { User } = require('../../models/user') // User模型

const router = new Router({
  prefix: '/v1/user/' // url路由前缀
})

// 注册
router.post('register', async(ctx) => {
  // 思维路径：1.接收参数，2.validator参数校验
  const v = await new RegisterValidator().validate(ctx)
  const user = { // 获取用户参数
    email: v.get('body.email'),
    password: v.get('body.password1'), // 密码在User Model加密
    nickname: v.get('body.nickname')
  }
  // 注册成功，保存数据库
  await User.create(user) // 返回User模型
  // 抛出成功 “异常”
  success()
})

module.exports = {
  router
}