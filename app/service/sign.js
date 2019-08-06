'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  

  // 查询单个信息
  async findSign(requestParam, token) {
    const { ctx } = this;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    if (m < 10 ) {
      m = '0' + m;
    }
    let d = date.getDate();
    if (d < 10 ) {
      d = '0' + d;
    }
    const dateVal = `${y}-${d}-${d}`;
    const result = await ctx.model.User.findOne({'openid': requestParam.openId})
    .then(res =>{
      if (res && res.data.createDate.include(dateVal)) {
        return {
          success: true,
          message: "已签到",
          code: 0,
          data: {
            hasSign: true
          }
        };
      }else{
        return {
          success: true,
          message: "未签到",
          code: 0,
          data: {
            hasSign: false
          }
        };
      }
      
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

  /**
   * 检查当前用户是否签到
   */
  async checkSign(requestParam,token) {
    const { ctx } = this;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    if (m < 10 ) {
      m = '0' + m;
    }
    let d = date.getDate();
    if (d < 10 ) {
      d = '0' + d;
    }
    const dateVal = `${y}-${m}-${d}`;
    const resData = await ctx.model.Sign.find({ openid: requestParam.openid, createDate:{ $in: dateVal} });
    ctx.coreLogger.info('数据：', resData);
    if (!!resData.length) {
      // 用户存在
      return  {
        signFlag: true
      };
    }else {
      return  {
        signFlag: false
      };
    }
   } 

  // 签到
  async add(requestParam,token) {
    const { ctx } = this;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    if (m < 10 ) {
      m = '0' + m;
    }
    let d = date.getDate();
    if (d < 10 ) {
      d = '0' + d;
    }
    const dateVal = `${y}-${m}-${d}`;
    const resData = await ctx.model.Sign.find({ openid: requestParam.openid, createDate:{ $in: dateVal} });
    if (!!resData.length) {
      // 用户存在
      return  {
        success: false,
        message: "用户已签到",
        code: 0,
        data: {},
        hasSign: true
      };
    }
    let reqData = {
      signId: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      userId: requestParam.openid,
      openid: requestParam.openid,
      nickName: requestParam.nickName,
      point: parseInt(requestParam.point || 0)+5,
      createDate: await ctx.helper.formatDate(new Date())
    }
    await ctx.model.User.updateOne({
        "openid": requestParam.openid
    },{
      point: parseInt(requestParam.point || 0)+5,
      updateDate: await ctx.helper.formatDate(new Date())
    })
    
    const result = await ctx.model.Sign.create(reqData).then(res =>{
      console.log('signadd')
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