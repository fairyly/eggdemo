'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/add', controller.user.add);
  router.get('/user/findAll', controller.user.findAll);
  router.get('/user/findUser', controller.user.findUser);
  router.get('/user/deleteUser', controller.user.deleteUser);
  router.get('/user/updateUser', controller.user.updateUser);
  router.get('/user/signUp', controller.user.signUp);
  router.get('/user/login', controller.user.login);
  router.get('/user/getOpenId', controller.user.getOpenId);
  router.get('/user/checkUser', controller.user.checkUser);

  router.get('/sign/add', controller.sign.add);
  router.get('/sign/findSign', controller.sign.findSign);

  router.post('/', controller.home.index);
  router.post('/user/add', controller.user.add);
  router.post('/user/findAll', controller.user.findAll);
  router.post('/user/findUser', controller.user.findUser);
  router.post('/user/deleteUser', controller.user.deleteUser);
  router.post('/user/updateUser', controller.user.updateUser);
  router.post('/user/signUp', controller.user.signUp);
  router.post('/user/login', controller.user.login);
  router.post('/user/getOpenId', controller.user.getOpenId);
  router.post('/user/checkUser', controller.user.checkUser);

  router.post('/upload', controller.upload.index);

  router.post('/sign/add', controller.sign.add);
  router.post('/sign/findSign', controller.sign.findSign);
};
