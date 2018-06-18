// app/router.js
// 不建议把路由规则逻辑散落在多个地方，会给排查问题带来困扰
// 
// 若确实有需求，可以如下拆分：

// app/router.js
// module.exports = app => {
//   require('./router/news')(app);
//   require('./router/admin')(app);
// };

// // app/router/news.js
// module.exports = app => {
//   app.router.get('/news/list', app.controller.news.list);
//   app.router.get('/news/detail', app.controller.news.detail);
// };

// // app/router/admin.js
// module.exports = app => {
//   app.router.get('/admin/user', app.controller.admin.user);
//   app.router.get('/admin/log', app.controller.admin.log);
// };

// 下面是路由的完整定义，参数可以根据场景的不同，自由选择：
// router.verb('path-match', app.controller.action);
// router.verb('router-name', 'path-match', app.controller.action);
// router.verb('path-match', middleware1, ..., middlewareN, app.controller.action);
// router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
 
// 内部重定向
// app.router.redirect('/', '/home/index', 302);
// 
// 外部重定向，controller 中添加
//  ctx.redirect(`https://www.google.co.kr/search?q=${q}`);
// 
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/login', controller.home.login);

  router.get('/news', controller.news.list);


  // router 中使用中间件
  // const gzip = app.middleware.gzip({ threshold: 1024 });
  // app.router.get('/login', gzip, app.controller.handler);
};