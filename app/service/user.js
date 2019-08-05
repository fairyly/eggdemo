'use strict';

const Service = require('egg').Service;
const uuidv5 = require('uuid/v5');

class UserService extends Service {
  // 登录（先查询是否存在）
  async login(requestParam) {
    const { ctx } = this;
    let token = await ctx.helper.createToken(ctx, { id: uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,'') })
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
      userAddress: requestParam.userAddress || '',
      userRole: '3', // 1: 管理员，2： 人事，3： 员工 
      hiredate: requestParam.hiredate || '',
      job: requestParam.job || '',
      createDate: await ctx.helper.formatDate(new Date()),
      updateDate: await ctx.helper.formatDate(new Date())
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
    let resToken = await ctx.helper.verifyToken(ctx, token);
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
      userSex: requestParam.userSex || '0', //0 :男； 1：女
      userPhoto: requestParam.userPhoto || '',
      userAddress: requestParam.userAddress || '',
      userRole: '3', // 1: 管理员，2： 人事，3： 员工 
      hiredate: requestParam.hiredate || '',
      job: requestParam.job || '',
      createDate: await ctx.helper.formatDate(new Date()),
      updateDate: await ctx.helper.formatDate(new Date())
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
  async findAll(requestParam, token) {
    const { ctx } = this;
    let resToken = await ctx.helper.verifyToken(ctx, token);
    if (!resToken.verify) {
      return {
        success: false,
        message: "token 已过期",
        code: 0,
        data: {}
      }
    }
    let total = await ctx.model.User.find();
    let currentPage = requestParam.currentPage;
    let pageSize = requestParam.pageSize;
    const querySkip = (currentPage - 1) * Number(pageSize);
    let result = await ctx.model.User.find().limit(pageSize || 10).skip(querySkip)
    .then(res =>{
      res.forEach( async (ele) => {
        ele.userPass = '';
      })
      return {
        success: true,
        message: "查询成功",
        code: 1,
        data: res,
        totalNum: total.length
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
    const result = await ctx.model.User.findOne({'userId': requestParam.openid})
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
    let resToken = await ctx.helper.verifyToken(ctx, token);
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
    
    const result = await ctx.model.User.updateOne({
        "openid": requestParam.openid
    },{
      point: requestParam.point,
      updateDate: await ctx.helper.formatDate(new Date())
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

  async getOpenId(requestParam) {
    const { ctx } = this;
    let authData = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=wx9a31344272cb44c9&secret=d2db5e4678016f4da636ad240f9444b9&js_code=${requestParam.code}&grant_type=authorization_code`).then(
      res=>{
        return  {
          success: true,
          message: "",
          code: 0,
          data: new Buffer(res.data).toString()
        };
     })
    return authData;
  }

  // 检查用户信息
  async checkUser(requestParam,token) {
    const { ctx } = this;
    const resData = await ctx.model.User.findOne({ openid: requestParam.openid });
    ctx.coreLogger.info('检查用户数据：', resData);
    if (!!resData) {
      // 用户存在
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
      let hasSign = false;
      let dateVal = `${y}-${m}-${d}`;
      const hasSignData = await ctx.model.Sign.findOne({ openid: requestParam.openid,createDate:{ $in: dateVal} });
      console.log(hasSignData,dateVal,hasSignData.createDate.includes(dateVal))
      ctx.coreLogger.info('数据：', hasSignData);
      if (!!hasSignData && hasSignData.createDate.includes(dateVal)) {
        hasSign = true;
      }
      ctx.coreLogger.info('hasSign数据：', hasSignData);

      return  {
        success: true,
        message: "用户已存在",
        code: 0,
        data: resData,
        hasSign: hasSign
      };
    }
    let reqData = {
      userId: requestParam.openid,//uuidv5((new Date().getTime())+'123.com', uuidv5.DNS).replace(/-/g,''),
      openid: requestParam.openid,
      nickName: requestParam.nickName,
      avatarUrl: requestParam.avatarUrl,
      gender: requestParam.gender,
      point: requestParam.point,
      country: requestParam.country,
      province: requestParam.province,
      city: requestParam.city,
      userName: requestParam.nickName,
      userEmail: requestParam.userEmail || '',
      userPass: requestParam.userPass || '',
      userAge: requestParam.userAge || '',
      userSex: requestParam.userSex || '0', //0 :男； 1：女
      userPhoto: requestParam.userPhoto || '',
      userAddress: requestParam.userAddress || '',
      userRole: '3', // 1: 管理员，2： 人事，3： 员工 
      hiredate: requestParam.hiredate || '',
      job: requestParam.job || '',
      createDate: await ctx.helper.formatDate(new Date()),
      updateDate: await ctx.helper.formatDate(new Date())
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