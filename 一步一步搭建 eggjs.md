# 一步一步搭建 eggjs

## 初始化项目
```
$ mkdir egg-init
$ cd egg-init
$ npm init
$ npm i egg --save
$ npm i egg-bin --save-dev
```

- 添加 npm scripts 到 package.json：

```
{
  "name": "egg-example",
  "scripts": {
    "dev": "egg-bin dev"
  }
}
```
## 编写 Controller
- 我们第一步需要编写的是 Controller 和 Router

```
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }
}

module.exports = HomeController;
```
