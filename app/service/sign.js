'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  

  // 查询单个信息
  async findUser(requestParam, token) {
    const { ctx } = this;
    const result = await ctx.model.User.findOne({'userId': requestParam.openId})
    .then(res =>{
      res.userPass = '';
      return {
        success: true,
        message: "查询成功",
        code: 1,
        data: new Buffer(res.data).toString()
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

 

  // 检查签到信息
  async checkUser(requestParam,token) {
    const { ctx } = this;
    const resData = await ctx.model.Sign.findOne({ openid: requestParam.openid });
    if (!!resData && resData.createDate) {
      // 用户存在
      return  {
        success: false,
        message: "用户已签到",
        code: 0,
        data: resData
      };
    }
    let reqData = {
      userId: requestParam.openid,
      openid: requestParam.openid,
      nickName: requestParam.nickName,
      point: resData.point + 5,
      createDate: await ctx.helper.formatDate(new Date())
    }
    const result = await ctx.model.User.create(reqData).then(res =>{
      return {
        success: true,
        message: "",
        code: 1,
        data: res
      };
    }).catch(err =>{
      return {
        success: false,
        message: "查询失败",
        code: 0,
        data: err
      };
    })
    return result;
  }
}
module.exports = UserService;