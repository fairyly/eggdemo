'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  // 添加用户信息
  async add() {
    const { ctx } = this;
    console.log(String(uuidv5((new Date().getTime())+'123.com', uuidv5.DNS)).replace(/-/g,''))
    const result = await ctx.model.User.create({
      userId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      userName: new Date().getTime(),
    }).then(res =>{
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