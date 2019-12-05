const { LinValidator, Rule } = require('../../core/lin-validator-v2') // 校验器
const { User } = require('../models/user') // User模型
const { LoginType, ArtType } = require('../lib/enum') // 用户登陆类型

// 校验id - 正整数
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      // 校验规则 inInt:正整数, 提示信息, [参数限制]
      new Rule('isInt', '需要是正整数', {
        min: 1
      })
    ]
  }
}

// 用户注册
class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.password1 = [
      new Rule('isLength', '密码6~18个字符', {
        min: 6,
        max: 18
      }),
      // 正则表达式
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z+$][0-9A-Za-z])')
    ]
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称2-14个字符', {
        min: 2,
        max: 12
      }),
    ]
  }

  /**
   * @description: 验证密码一致性
   * @param {Object} vals 用户传递的所有参数
   * @return: 
   */
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if(pwd1 !== pwd2) {
      throw new Error('密码不一致')
    }
  }

  // 验证注册邮箱
  async validateEmail(vals) {
    const email = vals.body.email
    // 查询数据库，是否已经存在 email
    const user = await User.findOne({ // 查询一条数据 - where email
      where: {
        email
      }
    })
    if(user) {
      // 该email邮箱已被注册
      throw new Error('email已被占用')
    }
  } 
}

// 登录 - token令牌
class TokenValidator extends LinValidator {
  constructor() {
    super()
    // 账号
    this.account = [
      new Rule('isLength', '账号4-64个字符', {
        min: 4,
        max: 64
      })
    ]
    // 密码 - 不必须（微信小程序），（传统Web需要），手机号登陆
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
      })
    ]
    // 登陆类型
    this.validateLoginType = checkLoginType
  }
}

// 验证token令牌是否有效
class NotEmptyValidator extends LinValidator {
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为null', {
        min: 1
      })
    ]
  }
}

// 收藏期刊参数验证
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.validateType = checkArtType
  }
}

// 验证期刊 type:期刊类型, id:期刊id
class ClassicValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.type = checkArtType
  }
}

// 搜索书籍
class SearchValidator extends LinValidator {
  constructor() {
    super()
    this.q = [
      new Rule('isLength', '搜索关键字不能为null', {
        min: 1,
        max: 16
      })
    ]
    // 分页 start - count
    // start
    this.start = [
      new Rule('isInt', 'start不符合规范', {
        min: 0,
        max: 60000
      }),
      new Rule('isOptional', '', 0) // start默认取 0
    ]
    // 获取书籍的数量 （count每页书籍的数量）
    this.count = [
      new Rule('isInt', 'start不符合规范', {
        min: 1,
        max: 20
      }),
      new Rule('isOptional', '', 20) // start默认取 20
    ]
  }
}

// 书籍短评
class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.myContent = [
      new Rule('isLength', '必须在1-120个字符之间', {
        min: 1,
        max: 120
      })
    ]
  }
}


// 验证LoginType类型字段是否存在
function checkLoginType(vals) {
  if(!vals.body.type) {
    throw new Error('type必填参数')
  }
  if(!LoginType.isThisType(vals.body.type)) {
    throw new Error('type参数不合法')
  }
}

// 验证ArtType类型字段是否存在
function checkArtType(vals) {
  if(!vals.body.type) {
    throw new Error('type必填参数')
  }
  if(!ArtType.isThisType(vals.body.type)) {
    throw new Error('type参数不合法')
  }
}


module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator
}