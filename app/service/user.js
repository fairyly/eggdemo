'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  /**
   * 生成 Token
   * @param {Object} data
   */
  async createToken(data) {
    const { ctx } = this;
    return ctx.app.jwt.sign(data, ctx.app.config.jwt.secret, {
      expiresIn: "2h"
    });
  }

  /**
   * 验证token的合法性
   * @param {String} token
   */
  async verifyToken(token) {
    const { ctx } = this;
    return new Promise((resolve, reject) => {
      ctx.app.jwt.verify(token, ctx.app.config.jwt.secret, function(err, decoded) {
        let result = {};
        if (err) {
          /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
          result.verify = false;
          result.message = err.message;
        } else {
          result.verify = true;
          result.message = decoded;
        }
        resolve(result);
      });
    });
  }

  // 登录（先查询是否存在）
  async login(requestParam) {
    const { ctx } = this;
    let token = await ctx.service.user.createToken({ id: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,'') })
    const result = await ctx.model.User.findOne({ userName: requestParam.userName }).then(res =>{
      if (res.userPass == requestParam.userPass) {
        return {
          success: true,
          message: "登录成功",
          code: 1,
          // 生成 token
          token: token
        };
      }else {
        return {
          success: true,
          message: "用户名或密码错误",
          code: 1,
          // 生成 token
          token: token
        };
      }
    }).catch(err =>{
      return {
        success: false,
        message: "用户名或密码错误",
        code: 0,
        data: err
      };
    })
    return result;
  }

  // 注册 (先查询用户名是否存在)
  async signUp(requestParam) {
    const { ctx } = this;
    const resData = await ctx.model.User.findOne({ userName: requestParam.userName });
    if (!!resData) {
      return  {
        success: false,
        message: "用户已存在",
        code: 0,
        data: {}
      };
    }
   
    let reqData = {
      userId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      userName: requestParam.userName,
      userEmail: requestParam.userEmail,
      userPass: requestParam.userPass,
      userAge: requestParam.userAge || '',
      userPhoto: requestParam.userPhoto || '',
      userSex: requestParam.userSex || '0', //0 :男； 1：女
    }
    const result = await ctx.model.User.create(reqData).then(res =>{
      return {
        success: true,
        message: "注册成功",
        code: 1,
        data: {}
      };
    }).catch(err =>{
      return {
        success: false,
        message: "注册失败",
        code: 0,
        data: err
      };
    })
    return result;
  }

  // 添加用户信息
  async add(requestParam,token) {
    const { ctx } = this;
    let resToken = await ctx.service.user.verifyToken(token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    const resData = await ctx.model.User.findOne({ userName: requestParam.userName });
    if (!!resData) {
      return  {
        success: false,
        message: "用户已存在",
        code: 0,
        data: {}
      };
    }
    let reqData = {
      userId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      userName: requestParam.userName,
      userEmail: requestParam.userEmail,
      userPass: requestParam.userPass,
      userAge: requestParam.userAge || '',
      userPhoto: requestParam.userPhoto || '',
      userSex: requestParam.userSex || '0', //0 :男； 1：女
    }
    const result = await ctx.model.User.create(reqData).then(res =>{
      return {
        success: true,
        message: "添加成功",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "添加失败",
        code: 0,
        data: err
      };
    })
    return result;
  }

  // 查询所有信息
  async findAll(token) {
    const { ctx } = this;
    let resToken = await ctx.service.user.verifyToken(token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    let result = await ctx.model.User.find()
    .then(res =>{
      return {
        success: true,
        message: "查询成功",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "查询失败",
        code: 0,
        data: []
      };
    })
    return result;
  }

  // 查询单个信息
  async findUser(requestParam, token) {
    const { ctx } = this;
    let resToken = await ctx.service.user.verifyToken(token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    const result = await ctx.model.User.findOne({'userId': requestParam.userId})
    .then(res =>{
      return {
        success: true,
        message: "查询成功",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "查询失败",
        code: 0,
        data: {}
      };
    })
    return result;
  }

  // 删除一个信息
  async deleteUser(requestParam, token){
    const { ctx } = this;
    let resToken = await ctx.service.user.verifyToken(token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    const result = await ctx.model.User.deleteOne({
        "userId": requestParam.userId
    }).then(res =>{
      return {
        success: true,
        message: "删除成功",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "删除失败",
        code: 0,
        data: err
      };
    })
    return result
  }

  // 更新
  async updateUser(requestParam, token) {
    const { ctx } = this;
    let resToken = await ctx.service.user.verifyToken(token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    const result = await ctx.model.User.updateOne({
        "userId": requestParam.userId
    },{
      userName: requestParam.userName,
      userEmail: requestParam.userEmail,
      userPass: requestParam.userPass,
      userAge: requestParam.userAge || '',
      userPhoto: requestParam.userPhoto || '',
      userSex: requestParam.userSex || '0', //0 :男； 1：女
    })
    .then(res =>{
      return {
        success: true,
        message: "更新成功",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "更新失败",
        code: 0,
        data: {}
      };
    })
    return result
  }
}
module.exports = UserService;