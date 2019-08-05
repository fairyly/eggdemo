'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SignSchema = new Schema({
    userId: {           // 用户 id
      type: String
    },
    nickName: {           // 用户 id
      type: String
    },
    openid: {         // openid
      type: String
    },
    point: {         // 积分
      type: String
    },
    createDate: {         // 创建时间
      type: String
    }
  });
  return mongoose.model('Sign', SignSchema);
};
