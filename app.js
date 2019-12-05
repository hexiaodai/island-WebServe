// ES6转ES5工具
require('babel-register')
require('babel-polyfill')

// 导入模块 - 初始化
const Koa = require('koa')
const parser = require('koa-bodyparser') // 中间件
const static = require('koa-static') // 获取静态资源文件路径（让static下的文件可以在提供地址访问） - 中间件
const path = require('path')
const { InitManager } = require('./core/init') // 初始化管理器
const { catchError } = require('./middlewares/exception') // 全局异常处理

// 实例化
const app = new Koa()

// 注册
app.use(catchError)
app.use(parser())
// __dirname: 项目目录绝对路径
// path.join(__dirname, './static'): 获取项目static文件绝对路径 - 让static下的文件可以在提供地址访问 （例：http://localhost:3000/images/music.1.png）
app.use(static(path.join(__dirname, './static')))

InitManager.initCore(app) // 初始化框架

// 导入模块
// require('./app/models/user') // 用户数据库模型

// 启动koa框架
app.listen(3000)
