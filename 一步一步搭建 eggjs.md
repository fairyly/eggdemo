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

- 此时目录结构如下：
```
egg-example
├── app
│   ├── controller
│   │   └── home.js
│   └── router.js
├── config
│   └── config.default.js
└── package.json
```
- 完整的目录结构规范参见[目录结构](http://eggjs.org/zh-cn/basics/structure.html)。

- 现在可以启动应用来体验下
```
$ npm run dev
$ open localhost:7001
```
>注意：
Controller 有 class 和 exports 两种编写方式，本文示范的是前者，你可能需要参考[ Controller 文档 ](http://eggjs.org/zh-cn/basics/controller.html)。
Config 也有 module.exports 和 exports 的写法，具体参考 [Node.js modules](https://nodejs.org/api/modules.html#modules_exports_shortcut) 文档

## 静态资源

`app` 目录下新建` public` 目录

`Egg` 内置了 `static` 插件，线上环境建议部署到` CDN`，无需该插件。

`static` 插件默认映射` /public/* -> app/public/*` 目录

此处，我们把静态资源都放到` app/public `目录即可：
```
app/public
├── css
│   └── news.css
└── js
    ├── lib.js
    └── news.js
```

# 模板渲染
绝大多数情况，我们都需要读取数据后渲染模板，然后呈现给用户。故我们需要引入对应的模板引擎

在本例中，我们使用` Nunjucks `来渲染，先安装对应的插件 `egg-view-nunjucks` ：

```
$ npm i egg-view-nunjucks --save
```
- 开启插件：
```
// config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};


// config/config.default.js
exports.keys = <此处改为你自己的 Cookie 安全字符串>;
// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};
```
>注意：是 config 目录，不是 app/config!

- 为列表页编写模板文件，一般放置在 app/view 目录下

```
<!-- app/view/news/list.tpl -->
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
  </head>
  <body>
    <ul class="news-view view">
      {% for item in list %}
        <li class="item">
          <a href="{{ item.url }}">{{ item.title }}</a>
        </li>
      {% endfor %}
    </ul>
  </body>
</html>
```

- 添加 Controller 和 Router

```
// app/controller/news.js
const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' }
      ]
    };
    await this.ctx.render('news/list.tpl', dataList);
  }
}

module.exports = NewsController;

// app/router.js
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);
};
```

- 启动浏览器，访问 http://localhost:7001/news 即可看到渲染后的页面


=================================================================

## 编写 service

在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。

我们来添加一个 Service 抓取 Hacker News 的数据 ，如下：

```
// app/service/news.js
const Service = require('egg').Service;

class NewsService extends Service {
  async list(page = 1) {
    // read config
    const { serverUrl, pageSize } = this.config.news;

    // use build-in http client to GET hacker-news api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
    });

    // parallel GET detail
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: 'json' });
      })
    );
    return newsList.map(res => res.data);
  }
}

module.exports = NewsService;
```

框架提供了内置的 HttpClient 来方便开发者使用 HTTP 请求。

- 然后稍微修改下之前的 Controller：

```
// app/controller/news.js
const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    await ctx.render('news/list.tpl', { list: newsList });
  }
}

module.exports = NewsController;
```

- 还需增加 app/service/news.js 中读取到的配置：

```
// config/config.default.js
// 添加 news 的配置项
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
};

```
>因为请求超时问题，访问 http://127.0.0.1:7001/news 会出现
ConnectionTimeoutError in /news
Connect timeout for 5000ms, GET https://hacker-news.firebaseio.com/v0/topstories.json -2 (connected: false, keepalive socket: false, agent status: 

##  编写扩展

遇到一个小问题，我们的资讯时间的数据是 UnixTime 格式的，我们希望显示为便于阅读的格式。

框架提供了一种快速扩展的方式，只需在 app/extend 目录下提供扩展脚本即可，具体参见扩展。

在这里，我们可以使用 View 插件支持的 Helper 来实现：

```
$ npm i moment --save
// app/extend/helper.js
const moment = require('moment');
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();
在模板里面使用：

<!-- app/view/news/list.tpl -->
{{ helper.relativeTime(item.time) }}
```

## 编写 Middleware

假设有个需求：我们的新闻站点，禁止百度爬虫访问。

聪明的同学们一定很快能想到可以通过 Middleware 判断 User-Agent，如下：

```
// app/middleware/robot.js
// options === app.config.robot
module.exports = (options, app) => {
  return async function robotMiddleware(ctx, next) {
    const source = ctx.get('user-agent') || '';
    const match = options.ua.some(ua => ua.test(source));
    if (match) {
      ctx.status = 403;
      ctx.message = 'Go away, robot.';
    } else {
      await next();
    }
  }
};

// config/config.default.js
// add middleware robot
exports.middleware = [
  'robot'
];
// robot's configurations
exports.robot = {
  ua: [
    /Baiduspider/i,
  ]
};
```

## 拓展知识

每一次用户请求，框架都会实例化对应的 Service 实例，由于它继承于 egg.Service，故拥有下列属性方便我们进行开发：

```
this.ctx: 当前请求的上下文 Context 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
this.app: 当前应用 Application 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
this.service：应用定义的 Service，通过它我们可以访问到其他业务层，等价于 this.ctx.service 。
this.config：应用运行时的配置项。
this.logger：logger 对象，上面有四个方法（debug，info，warn，error），分别代表打印四个不同级别的日志，使用方法和效果与 context logger 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置
```

## Service ctx 详解

为了可以获取用户请求的链路，我们在 Service 初始化中，注入了请求上下文, 用户在方法中可以直接通过 this.ctx 

来获取上下文相关信息。关于上下文的具体详解可以参看 Context, 有了 ctx 

我们可以拿到框架给我们封装的各种便捷属性和方法。比如我们可以用：

```
this.ctx.curl 发起网络调用。
this.ctx.service.otherService 调用其他 Service。
this.ctx.db 发起数据库调用等， db 可能是其他插件提前挂载到 app 上的模块。
```

>注意事项
Service 文件必须放在 app/service 目录，可以支持多级目录，访问的时候可以通过目录名级联访问。

```
app/service/biz/user.js => ctx.service.biz.user
app/service/sync_user.js => ctx.service.syncUser
app/service/HackerNews.js => ctx.service.hackerNews
一个 Service 文件只能包含一个类， 这个类需要通过 module.exports 的方式返回。
```

Service 需要通过 Class 的方式定义，父类必须是 egg.Service。

Service 不是单例，是 请求级别 的对象，框架在每次请求中首次访问 ctx.service.xx 时延迟实例化，

所以 Service 中可以通过 this.ctx 获取到当前请求的上下文


## 使用 Service

下面就通过一个完整的例子，看看怎么使用 Service。
```
// app/router.js
module.exports = app => {
  app.router.get('/user/:id', app.controller.user.info);
};



// app/controller/user.js
const Controller = require('egg').Controller;
class UserController extends Controller {
  async info() {
    const userId = ctx.params.id;
    const userInfo = await ctx.service.user.find(userId);
    ctx.body = userInfo;
  }
}
module.exports = UserController;



// app/service/user.js
const Service = require('egg').Service;
class UserService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  async find(uid) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.ctx.db.query('select * from user where uid = ?', uid);

    // 假定这里还有一些复杂的计算，然后返回需要的信息。
    const picture = await this.getPicture(uid);

    return {
      name: user.user_name,
      age: user.age,
      picture,
    };
  }

  async getPicture(uid) {
    const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, { dataType: 'json' });
    return result.data;
  }
}
module.exports = UserService;

// curl http://127.0.0.1:7001/user/1234
```


### 参考资料

- http://eggjs.org/zh-cn/intro/quickstart.html
- [issue: Please set config.keys first]: https://cnodejs.org/topic/59102863d371b6372a8af6b4