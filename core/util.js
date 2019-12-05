/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 11:14:25
 * @LastEditTime: 2019-08-09 15:10:13
 * @LastEditors: Please set LastEditors
 */
const jwt = require('jsonwebtoken') // 令牌
/***
 * 
 */
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}

/**
 * @description: 登陆令牌
 * @param {String} uid 用户id
 * @param {String} scope 权限
 * @return: 登陆令牌
 */
const generateToken = function (uid, scope) {
    const secretKey = global.config.security.secretKey // 私有的key
    const expiresIn = global.config.security.expiresIn // 令牌过期时间 - 1小时
    // 生成令牌
    const token = jwt.sign({
        uid,
        scope
    }, secretKey, { 
        expiresIn
    })
    return token
}

module.exports = {
    findMembers,
    generateToken
}