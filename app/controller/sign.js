'use strict';

const Controller = require('egg').Controller;

class SignController extends Controller {

  

  // 增加
  async add() {
    const { ctx } = this;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let token = ctx.header.token;
    ctx.body = await ctx.service.sign.add(requestParam, token);
  }
  
  // 查询单个
  async findSign() {
    const { ctx } = this;
    let token = ctx.header.token;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let res = await ctx.service.sign.findSign(requestParam, token);
    ctx.body = res;
  }
  // 查询所有
  async findAllSign() {
    const { ctx } = this;
    let token = ctx.header.token;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let res = await ctx.service.sign.findSign(requestParam, token);
    ctx.body = res;
  }
  
}

module.exports = SignController;