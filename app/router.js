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
};
