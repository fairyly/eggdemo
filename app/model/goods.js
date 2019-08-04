'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GoodsSchema = new Schema({
    goodId: {           // id
      type: String,
      unique: true
    },
    goodName: {         // 名字
      type: String
    },
    goodImage: {         // good图片
      type: String
    },
    goodPoint: {         // 积分
      type: String
    },
    createDate: {         // 创建时间
      type: String
    },
    updateDate: {         // 更新时间
      type: String
    },
  });
  return mongoose.model('Goods', GoodsSchema);
};
