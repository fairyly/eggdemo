/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556272169392_8629';

  // add your middleware config here
  config.middleware = [
    'errorHandler'
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['*']
  };

  config.cors = {
    enable: true,
    package: 'egg-cors',
  },

  // 跨域
  config.cors = {
    origin: 'http://127.0.0.1:3000', // 访问白名单,根据你自己的需要进行设置
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  
  // 数据库
  config.mongoose = {
    url: 'mongodb://127.0.0.1/apiEgg',//'mongodb://myblog:myblog@ds139327.mlab.com:39327/apiEgg',
    options: {},
  };

  config.jwt = {
    secret: "123456"
  };

  return {
    ...config,
    ...userConfig,
  };
};
