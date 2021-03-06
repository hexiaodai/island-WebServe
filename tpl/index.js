module.exports = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>何小呆的手记</title>
  <style>
    * {
      margin: 0;
    }

    .abs {
      color: black;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%);
    }

    .nav {
      height: 66px;
      width: 100%;
      text-align: center;
      line-height: 66px;
      font-size: 22px;
      background-color: bisque;
    }

    .logo {
      width: 100%;
      height: 100%;
    }

    .logo-img {
      height: 100%;;
    }

    .main {
      width: 100%;
      display: flex;
    }

    .rigth img {
      width: 60%;
      margin-left: 30%;
    }

    .item {
      margin-bottom: 18px;
    }
  </style>
</head>

<body>
  <div class="nav">
    <div class="logo"><img class="logo-img" src="https://s2.ax1x.com/2019/09/22/uCMpoq.png" alt="Logo"></div>
    <div>何小呆的手记</div>
  </div>
  <div class="main">
    <div class="left">
      <ul>
        <li class="item">
          如何理解HTML语义化？
          <ul>
            <li>让人更容易读懂代码</li>
            <li>让搜索引擎更容易读懂（SEO）</li>
          </ul>
        </li>

        <li class="item">
          Line-height的继承问题？
          <ul>
            <li>百分比：根据父元素font-size继承计算出来的值</li>
            <li>其他：根据自元素font-size计算</li>
          </ul>
        </li>

        <li class="item">
          去除inline-block元素之间的边距方法？
          <ul>
            <li>移除空格</li>
            <li>使用margin负值</li>
            <li>使用父元素font-size: 0</li>
          </ul>
        </li>

        <li class="item">
          何时使用==何时使用===？
          <ul>
            <li>==会尝试数据类型转换在比较</li>
            <li>===不会类型转换，直接比较</li>
            <li>判断遍历是否为null或者undefined是使用==，其余使用===</li>
          </ul>
        </li>

        <li class="item">
          前端使用异步的场景？
          <ul>
            <li>setTimeOut()，setInterval()</li>
            <li>ajax网络请求</li>
            <li>事件绑定</li>
          </ul>
        </li>

        <li class="item">
          Vue-router函数钩子？
          <ul>
            <li>全局钩子：router.beforeEach(to, from, next) 跳转前进行拦截判断</li>
            <li>组件内的钩子：beforeRouterEnter()，beforeUpdate()，beforeLeave()</li>
            <li>单独路由钩子：beforeEnter()</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="rigth">
      <img src="https://s2.ax1x.com/2019/09/22/uCuuu9.png" alt="">
    </div>
  </div>



  <a class="abs" href="http://www.beian.miit.gov.cn" target="_blank">湘ICP备18023761号</a>
</body>

</html>
`