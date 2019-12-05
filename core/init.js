/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 20:44:50
 * @LastEditTime: 2019-08-09 16:08:29
 * @LastEditors: Please set LastEditors
 */
const Router = require('koa-router')
const requireDirectory = require('require-directory') // 自动导入模块组件 - 路由模块

// 初始化管理器
class InitManager {
  /**
   * @description: 入口方法
   * @param {Object}
   */
  static initCore(app) {
    InitManager.app = app
    InitManager.loadConfig()
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
  }

  /**
   * @description: 初始化 ruoter模块
   */
  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/api` // process.cwd():获取项目根目录决定路径
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    }) // 自动导入api下的模块

    function whenLoadModule(obj) {
      // 判断 obj是否为router
      if(obj instanceof Router) {
        InitManager.app.use(obj.routes()) // 注册 - 路由
      } else if (obj.router instanceof Router) {
        InitManager.app.use(obj.router.routes())
      }
    }
  }

  /**
   * 默认不启用
   * @description: 全局导入 http-exception.js
   */
  static loadHttpException() {
    const errors = require('../core/http-exception')
    global.errs = errors // 将errors挂载到global.errs上
  }

  /**
   * @description: 全局导入 config.js
   */
  static loadConfig(path='') {
    const configPath = path || `${process.cwd()}/config/config.js`
    const config = require(configPath)
    global.config = config
  }
}

module.exports = {
  InitManager
}