/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 11:58:50
 * @LastEditTime: 2019-08-09 18:10:55
 * @LastEditors: Please set LastEditors
 */
// 配置文件
module.exports = {
  environment: 'dev', // dev:开发环境, prod:生产环境
  // 数据库配置参数
  database: {
    dbName: 'island',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0819'
  },
  // 用户登陆令牌参数
  security: {
    secretKey: 'abcdefg', // 私有的key
    expiresIn: 60*60*24*30 // 令牌过期时间 - 1小时 (开发阶段 30天)
  },
  // 微信登陆 - 微信服务提供
  wx: {
    appID: 'wxcae4528862a54e99',
    appSecret: '7d07469e97be0ae254e68adc9fbf58fd',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code' // 登陆微信小程序url
  },
  // 第三方接口 - 书籍
  yushu:{
      detailUrl:'http://t.yushu.im/v2/book/id/%s', // 书籍详细书籍
      keywordUrl:'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s' // 搜索书籍
  },
  host: 'http://localhost:3000/'
  // host: 'https://www.sqhldh.xyz/'
}