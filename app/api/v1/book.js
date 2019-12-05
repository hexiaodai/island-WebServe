// 导入koa-router
const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth') // 解析 token
const { APIAccess } = require('../../lib/enum') // API权限级别 - 取值
const { HotBook } = require('../../models/hot-book') // 热门书籍模型
const { Book } = require('../../models/book') // 热门书籍模型
const { Favor } = require('../../models/favor')
const { Comment } = require('../../models/book-comment')
const { success } = require('../../lib/helper')
const {
  PositiveIntegerValidator, 
  SearchValidator, 
  AddShortCommentValidator 
} = require('../../validators/validator') // 校验器

const router = new Router({
  prefix: '/v1/book'
})

// 获取所有热门书籍
router.get('/hotList', new Auth(APIAccess.USER).m, async (ctx, next) => {
  const hotBooks = await HotBook.getAll()
  ctx.body = {
    hotBooks
  }
})

// 获取书籍详情
router.get('/:id/detail', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  // const book = new Book(v.get('path.id')) // 传递书籍id
  const detail = await Book.detail(v.get('path.id')) // 传递书籍id
  ctx.body = {
    detail: detail
  }
})

// 书籍搜索
router.get('/search', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new SearchValidator().validate(ctx)
  const bookList = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'))
  ctx.body = {
    bookList
  }
})

// 获取我喜欢的书籍数量
router.get('/favor/count', new Auth(APIAccess.USER).m, async (ctx) => {
  const bookLikeCount = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    bookLikeCount
  }
})

// 获取书籍点赞信息
router.get('/:bookId/favor', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId'
  })
  const favor = await Favor.getBookFavor(v.get('path.bookId'), ctx.auth.uid)
  ctx.body = favor
})

// 书籍短评
router.post('/add/shortComment', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: 'bookId'
  })
  const bookId = v.get('body.bookId') // 书籍id
  const myContent = v.get('body.myContent') // 短评
  await Comment.addComment(bookId, myContent)
  success() // 操作成功
})

// 获取书籍短评
router.get('/:bookId/shortComment', new Auth(APIAccess.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId'
  })
  const comments = await Comment.getComments(v.get('path.bookId'))
  ctx.body = comments
})

// 热门书籍搜索关键字 - 假数据
router.get('/hotKeyword', new Auth(APIAccess.USER).m, async (ctx) => {
  ctx.body = {
    'hot': [
      '白夜行',
      '村上村树',
      '韩寒',
      '金庸',
      '王小波',
      'JavaScript',
      '偷影子的人'
    ]
  }
})

module.exports = {
  router
}