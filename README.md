# eggdemo
- website: http://eggjs.org
- doc: http://eggjs.org/zh-cn/intro/quickstart.html
- 实现 RESTful API DEMO: https://github.com/eggjs/examples/tree/master/cnode-api
## egg-plugin

- https://github.com/topics/egg-plugin

## 插件开发
### 使用脚手架快速开发
```
你可以直接通过 egg-init 选择 plugin 脚手架来快速上手。

$ egg-init --type=plugin egg-hello
$ cd egg-hello
$ npm i
$ npm test
```

### 目录结构
```
. egg-hello
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
│   ├── extend (可选)
│   |   ├── helper.js (可选)
│   |   ├── request.js (可选)
│   |   ├── response.js (可选)
│   |   ├── context.js (可选)
│   |   ├── application.js (可选)
│   |   └── agent.js (可选)
│   ├── service (可选)
│   └── middleware (可选)
│       └── mw.js
├── config
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    └── middleware
        └── mw.test.js
```
### 插件需要在 package.json 中的 eggPlugin 节点指定插件特有的信息：

- {String} name - 插件名（必须配置），具有唯一性，配置依赖关系时会指定依赖插件的 name。

- {Array} dependencies - 当前插件强依赖的插件列表（如果依赖的插件没找到，应用启动失败）。

- {Array} optionalDependencies - 当前插件的可选依赖插件列表（如果依赖的插件未开启，只会 warning，不会影响应用启动）。

- {Array} env - 只有在指定运行环境才能开启，具体有哪些环境可以参考运行环境。此配置是可选的，一般情况下都不需要配置。

```
{
  "name": "egg-rpc",
  "eggPlugin": {
    "name": "rpc",
    "dependencies": [ "registry" ],
    "optionalDependencies": [ "vip" ],
    "env": [ "local", "test", "unittest", "prod" ]
  }
}
```
### 扩展内置对象的接口

在插件相应的文件内对框架内置对象进行扩展，和应用一样

```
app/extend/request.js - 扩展 Koa#Request 类
app/extend/response.js - 扩展 Koa#Response 类
app/extend/context.js - 扩展 Koa#Context 类
app/extend/helper.js - 扩展 Helper 类
app/extend/application.js - 扩展 Application 类
app/extend/agent.js - 扩展 Agent 类
```
