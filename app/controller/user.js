'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  // 注册
  async signUp() {
    const { ctx } = this;
    const rule = {
      userName: { type: 'string', required: false, message: '必填项' },
      userPass: { type: 'string', required: false, message: '必填项' },
      userEmail: { type: 'email', required: false, message: '必填项' },
    };
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    await ctx.validate(rule, requestParam);
    ctx.body = await ctx.service.user.signUp(requestParam);
  }

  // 登录
  async login() {
    const { ctx } = this;
    const rule = {
      userName: { type: 'string', required: false, message: '必填项' },
      userPass: { type: 'string', required: false, message: '必填项' }
    };
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    await ctx.validate(rule, requestParam);
    ctx.body = await ctx.service.user.login(requestParam);
  }

  // 增加
  async add() {
    const { ctx } = this;
    const rule = {
      userName: { type: 'string', required: false, message: '必填项' },
      userPass: { type: 'string', required: false, message: '必填项' },
      userEmail: { type: 'email', required: false, message: '必填项' },
    };
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    await ctx.validate(rule, requestParam);
    let token = ctx.header.token;
    ctx.body = await ctx.service.user.add(requestParam, token);
  }
  // 查询所有
  async findAll() {
    const { ctx } = this;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let token = ctx.header.token;
    let res = await ctx.service.user.findAll(requestParam, token);
    ctx.body = res;
  }
  // 查询单个
  async findUser() {
    const { ctx } = this;
    let token = ctx.header.token;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let res = await ctx.service.user.findUser(requestParam, token);
    ctx.body = res;
  }
  // 删除单个
  async deleteUser() {
    const { ctx } = this;
    let token = ctx.header.token;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let res = await ctx.service.user.deleteUser(requestParam, token);
    ctx.body = res;
  }

  // 更新数据
  async updateUser() {
    const { ctx } = this;
    let token = ctx.header.token;
    const rule = {
      userName: { type: 'string', required: false, message: '必填项' },
      userPass: { type: 'string', required: false, message: '必填项' },
      userEmail: { type: 'email', required: false, message: '必填项' },
    };
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    await ctx.validate(rule, requestParam);
    let res = await ctx.service.user.updateUser(requestParam, token);
    ctx.body = res;
  }

  // 获取openid
  async getOpenId() {
    const { ctx } = this;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    // await ctx.validate(rule, requestParam);
    let res = await ctx.service.user.getOpenId(requestParam);
    ctx.body = res;
  }

  // 检查数据
  async checkUser() {
    const { ctx } = this;
    let token = ctx.header.token;
    // const rule = {
    //   userName: { type: 'string', required: false, message: '必填项' },
    //   userPass: { type: 'string', required: false, message: '必填项' },
    //   userEmail: { type: 'email', required: false, message: '必填项' },
    // };
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    // await ctx.validate(rule, requestParam);
    let res = await ctx.service.user.checkUser(requestParam, token);
    ctx.body = res;
  }
}

module.exports = UserController;