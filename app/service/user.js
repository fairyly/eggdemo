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
      expiresIn: "12h"
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

  // 添加用户信息
  async add() {
    const { ctx } = this;
    let token = await ctx.service.user.createToken({ id: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,'') })
    const result = await ctx.model.User.create({
      userId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      userName: new Date().getTime(),
    }).then(res =>{
      return {
        success: true,
        message: "添加成功",
        code: 1,
        data: res,
        // 生成 token
        token: token
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
  async findAll() {
    let result = await this.ctx.model.User.find()
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
  async findUser() {
    const result = await this.ctx.model.User.findOne({'userName': 'test'})
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
  async deleteUser(){
    const result = await this.ctx.model.User.deleteOne({
        "userName":"1556352664529"
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
  async updateUser() {
    const result = await this.ctx.model.User.updateOne({
        "userId":"aa21745962a3-5c76-8003-26ec20611512"
    },{"userName": "test"}).then(res =>{
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