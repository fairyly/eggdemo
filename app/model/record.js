'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RecordSchema = new Schema({
    userId: {           // 用户 id
      type: String,
      unique: true
    },
    openid: {         // openid
      type: String
    },
    goodId: {         // goodid
      type: String
    },
    goodName: {         // goodid
      type: String
    },
    point: {         // 积分
      type: String
    },
    createDate: {         // 创建时间
      type: String
    }
  });
  return mongoose.model('Record', RecordSchema);
};
