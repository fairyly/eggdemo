'use strict';

const Controller = require('egg').Controller;

class GoodController extends Controller {

  

  // 增加
  async add() {
    const { ctx } = this;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let token = ctx.header.token;
    ctx.body = await ctx.service.good.add(requestParam, token);
  }
  
  // 查询单个
  async findGood() {
    const { ctx } = this;
    let token = ctx.header.token;
    const requestParam = !!Object.keys(ctx.request.body).length ? ctx.request.body : ctx.request.query;
    let res = await ctx.service.good.findGood(requestParam, token);
    ctx.body = res;
  }
  
}

module.exports = GoodController;