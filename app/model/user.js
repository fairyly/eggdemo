'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userId: {           // 用户 id
      type: String,
      unique: true,
      required: true,
    },
    userName: {         // 用户名字
      type: String,
      required: true,
    },
    userPass: {         // 用户密码
      type: String,
      required: true,
    },
    userEmail: {        // 用户邮箱
      type: String,
      required: true,
    },
    userAge: {          // 用户年龄
      type: String
    },
    userSex: {          // 用户性别
      type: String
    },
    userPhoto: {        // 用户头像
      type: String
    },
    userAddress: {      // 用户地址
      type: String
    },
    userRole: {      // 用户角色
      type: String
    },
    hiredate: {         // 入职时间
      type: String
    },
    job: {              // 职位
      type: String
    },
    createDate: {         // 创建时间
      type: String
    },
    updateDate: {         // 更新时间
      type: String
    }
  });
  return mongoose.model('User', UserSchema);
};
