'use strict';

/** @type Egg.EggPlugin */
//module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
//};
  // 
  exports.cors = {
    enable: true,
    package: 'egg-cors',
  },

  exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
  }

  exports.validate = {
    enable: true,
    package: 'egg-validate',
  };

  exports.jwt = {
    enable: true,
    package: "egg-jwt"
  };

  exports.bcrypt = {
    enable: true,
    package: 'egg-bcrypt'
  };

  exports.alinode = {
    enable: true,
    package: 'egg-alinode'
  };

