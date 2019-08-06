'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  

  // 查询单个用户签到信息
  async findGood(requestParam, token) {
    const { ctx } = this;
    const result = await ctx.model.Sign.find({'openid': requestParam.openId})
    .then(res =>{
      return {
        success: true,
        message: "查询成功",
        code: 0,
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

  

  // 添加商品
  async add(requestParam,token) {
    const { ctx } = this;
   
    const resData = await ctx.model.Good.findOne({ goodName: requestParam.goodName });
    if (!!resData.length) {
      // 用户存在
      return  {
        success: false,
        message: "商品已存在",
        code: 0,
        data: {}
      };
    }
    let reqData = {
      goodId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      goodName: requestParam.goodName,
      goodImage: requestParam.goodImage,
      goodPoint: requestParam.goodPoint,
      createDate: await ctx.helper.formatDate(new Date()),
      updateDate: await ctx.helper.formatDate(new Date()),
    }
    const result = await ctx.model.Good.create(reqData).then(res =>{
      console.log('goodadd')
      return {
        success: true,
        message: "",
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
}
module.exports = UserService;