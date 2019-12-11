# island-WebServer & island-wx（[微信小程序客户端](https://e.coding.net/hxd/island-nodeServer.git)）
#### 软件架构
技术栈：Node.js + MySQL + Koa2

#### 安装教程

```
npm install
node app.js
pm2 start app.js
```
#### 项目tree
```
├── app
│   ├── api                API接口
│   │   └── v1             第一个版本API
│   │       ├── book.js
│   │       ├── classic.js
│   │       ├── like.js
│   │       ├── token.js
│   │       └── user.js             
│   ├── lib                公共的产量、助手函数等
│   │   ├── enum.js
│   │   └── helper.js
│   ├── models             数据库查询接口，提供查询数据、修改数据、删除数据接口
│   │   ├── art.js
│   │   ├── book-comment.js
│   │   ├── book.js
│   │   ├── classic.js
│   │   ├── cloud-music.js
│   │   ├── favor.js
│   │   ├── flow.js
│   │   ├── hot-book.js
│   │   └── user.js
│   ├── services           API服务对象
│   │   └── wx.js          微信端配置
│   └── validators         验证参数
│       └── validator.js
├── app.js                 服务启动文件
├── config                 配置文件，数据库、用户令牌、微信AppID
│   └── config.js
├── core                   数据库模型
│   ├── db.js
│   ├── http-exception.js
│   ├── init.js
│   ├── lin-validator-v2.js
│   ├── lin-validator.js
│   └── util.js
├── middlewares            中间件
│   ├── auth.js            全局异常处理
│   └── exception.js       全局异常处理
├── notes.md
├── package.json
├── sql                    MySQL数据库文件
│   ├── flow.sql
│   ├── hot_book.sql
│   ├── island.sql
│   ├── movie.sql
│   ├── music.sql
│   └── sentence.sql
├── static                 静态资源
│   ├── images
│   └── style
```
#### 数据库结构
![输入图片说明](https://images.gitee.com/uploads/images/2019/1205/191242_77b78bdb_5174336.png "屏幕截图.png")

#### 使用说明

```
URL        前缀 http://127.0.0.1:3000/v1/classic/latest
GET        /classic/latest
API        支持json
error_code 表示错误码
msg        表示错误信息
跨域        无跨域限制，需要携带token
```

#### 返回码
```
HTTP 状态码
200    请求成功
201    创建成功
202    更新成功
204    删除成功
301    永久重定向
400    请求包含不支持的参数
401    未授权
403    被禁止访问
404    请求的资源不存在
500    服务器内部错误

错误码（error_code）
100x    通用类型
0	OK, 成功
1000    输入参数错误
1001	输入的json格式不正确
1002	找不到资源
1003	未知错误
1004	禁止访问
1005	不正确的开发者key
1006	服务器内部错误
200x    点赞类型
2000	你已经点过赞了
2001	你还没点过赞
300x    期刊类型
3000	该期内容不存在
```

### 期刊 API
##### 获取最新一期
- URL:
```
GET    /classic/latest
```
- Response 200:

```
{
    "content": "人生不能像做菜，把所有的料准备好才下锅",
    "fav_nums": 0,
    "id": 1,
    "image": "http://127.0.0.1:5000/images/movie.7.png",
    "index": 7,
    "like_status": 0,
    "pubdate": "2018-06-22",
    "title": "李安<<饮食男女>>",
    "type": 100
}
```
- Response_description:
```
content       期刊内容
fav_nums      点赞次数
image         图片
index         期号
like_status   是否点赞
pubdate       发布日期
title         期刊题目
type          期刊类型,这里的类型分为:100 电影 200 音乐 300 句子
id            期刊在数据中序号，供点赞使用
返回期刊的详细信息
```
##### 获取当前一期的下一期
- URL:
```
GET    /classic/<int:index>/next
index  期号,必填,必须是正整数
```
- Response 200:

```
{
    "content": "这个夏天又是一个毕业季",
    "fav_nums": 0,
    "id": 2,
    "image": "http://bl.yushu.im/images/sentence.2.png",
    "index": 2,
    "like_status": 0,
    "pubdate": "2018-06-22",
    "title": "未名",
    "type": 300
}
```
##### 获取某一期详细信息
- URL:
```
GET    /classic/<int:type>/<int:id>
id     id号,必填,必须是正整数
type   类型号，必填，为100,200,300的一种，分别表示电影，音乐，句子
```
- Response 200:

```
{
    "content": "这个夏天又是一个毕业季",
    "fav_nums": 0,
    "id": 2,
    "image": "http://bl.yushu.im/images/sentence.2.png",
    "index": 2,
    "like_status": 0,
    "pubdate": "2018-06-22",
    "title": "未名",
    "type": 300
}
```
##### 获取当前一期的上一期
- URL:
```
GET    /classic/<int:index>/previous
index  期号,必填,必须是正整数
```
- Response 200:

```
{
    "content": "你陪我步入蝉夏 越过城市喧嚣",
    "fav_nums": 0,
    "image": "http://bl.yushu.im/images/music.1.png",
    "id": 3,
    "index": 1,
    "like_status": 0,
    "pubdate": "2018-06-22",
    "title": "纸短情长",
    "type": 200,
    "url": "http://music.163.com/song/media/outer/url?id=557581284.mp3"
}
```
##### 获取点赞信息
- URL:
```
GET    classic/<int:type>/<int:id>/favor
type   必填, 点赞类型
id     必填, 点赞对象的id号
```
- Response 200:

```
{
    "fav_nums": 1,
    "id": 1,
    "like_status": 1
}
```
##### 获取我喜欢的期刊
- URL:
```
GET    /classic/favor
start  开始的页数,默认为1
count  每页的内容条数,不超过20,默认为20
```
- Response 200:

```
[
    {
            "content": "人生不能像做菜，把所有的料准备好才下锅",
            "fav_nums": 1,
            "id": 1,
            "image": "http://bl.yushu.im/images/movie.7.png",
            "pubdate": "2018-06-22",
            "title": "李安<<饮食男女>>",
            "type": 100
    }
    {
            "content": "你陪我步入蝉夏 越过城市喧嚣",
            "fav_nums": 0,
            "id": 3,
            "image": "http://bl.yushu.im/images/music.1.png",
            "index": 1,
            "like_status": 0,
            "pubdate": "2018-06-22",
            "title": "纸短情长",
            "type": 200,
            "url": "http://music.163.com/song/media/outer/url?id=557581284.mp3"
    }
]
```
### 书籍
##### 获取热门书籍
- URL:
```
GET    /book/hot_list
```
- Response 200:

```
[
    {
        "author": "陈儒",
        "fav_nums": 0,
        "id": 18,
        "image": "https://img3.doubanio.com/lpic/s3435132.jpg",
        "like_status": 0,
        "title": "Python源码剖析"
    },
    {
        "author": "MarkPilgrim",
        "fav_nums": 0,
        "id": 58,
        "image": "https://img3.doubanio.com/lpic/s29631790.jpg",
        "like_status": 0,
        "title": "Dive Into Python"
    },
    {
        "author": "MarkPilgrim",
        "fav_nums": 0,
        "id": 65,
        "image": "https://img3.doubanio.com/lpic/s4059293.jpg",
        "like_status": 0,
        "title": "Dive Into Python 3"
    },
]
```
- response_description:

```
fav_nums    点赞数
id          书籍id
like_status 是否点赞
author      作者
title       书籍题目
image       书籍图片
返回一个列表，包含所有热门书籍的概要信息
```
##### 获取书籍短评
- URL:
```
GET        /book/<int:book_id>/short_comment
book_id    书籍的id,必填,必须为正整数
```
- Response 200:

```
{
    "comment":
    [
        {
           "content": "i hate6!",
           "nums": 1
        }
    ],
    "book_id": 1
}
```
- Response_description:

```
comment    一个评论的列表,包含用户对书籍的评论及对应数量的字典
book_id    书籍id
```
##### 获取喜欢书籍数量
- URL:
```
GET        /book/favor/count
```
- Response 200:

```
{
    "count": 10,
}
```
- Response_description:

```
count    返回我喜欢的书籍数量
```
##### 获取书籍点赞情况
- URL:
```
GET        /book/<int:book_id>/favor
book_id    书籍的id,必填,必须为正整数
```
- Response 200:

```
{
    "fav_nums": 0,
    "id": 1,
    "like_status": 0
}
```
##### 获取书籍点赞情况
- URL:
```
GET        /book/add/short_comment
book_id    书籍id
content    评论内容,我们可允许的评论内容范围为12字以内
```
- Response 200:

```
{
    "error_code": 0,
    "msg": "ok",
    "request": "POST  /book/add_short_comment"
}
```
#### 新增评论
- URL:
```
GET        /book/add/short_comment
book_id    书籍id
content    评论内容,我们可允许的评论内容范围为12字以内
```
- Response 200:

```
{
    "error_code": 0,
    "msg": "ok",
    "request": "POST  /book/add_short_comment"
}
```
##### 获取热搜关键字
- URL:
```
GET        /book/hot_keyword
```
- Response 200:

```
{
    "hot":
    [
        "Fluent Python",
        "Python",
        "Java核心编程",
        "JavaScript",
        "ES6基础入门",
        "C++"
    ]
}
```
##### 书籍搜索
- URL:
```
GET        /book/search
start      开始记录数，默认为0
count      记录条数，默认为20,超过依然按照20条计算
summary    返回完整或简介,默认为0,0为完整内容,1为简介
q          搜索内容,比如你想搜索python相关书籍,则输入python
```
- Response 200:

```
// ...
```
##### 获取书籍详细信息
- URL:
```
GET        /book/<id>/detail
```
- Response 200:

```
// ...
```
##### 获取书籍详细信息
- URL:
```
GET        /book/<id>/detail
```
- Response 200:

```
// ...
```
### 点赞
##### 进行点赞
- URL:
```
GET        /like
art_id     点赞对象,例如你想对电影进行点赞，那这个参数就是电影的id号
type       点赞类型分为四种：100 电影 200 音乐 300 句子 400 书籍
```
- Response 201:

```
// ...
```
##### 取消点赞
- URL:
```
GET        /like/cancel
art_id     点赞对象id
type       点赞类型
```
- Response 201:

```
// ...
```

