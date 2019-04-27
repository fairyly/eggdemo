'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 增加
  async add() {
    const { ctx } = this;
    const rule = {
      userName: { type: 'string', required: true, message: '必填项' },
      userPass: { type: 'string', required: true, message: '必填项' },
      userEmail: { type: 'email', required: true, message: '必填项' },
    };
    const requestParam = ctx.request.body;
    await ctx.validate(rule, requestParam);
    ctx.body = await ctx.service.user.add();
  }
  // 查询所有
  async findAll() {
    const { ctx } = this;
    let res = await ctx.service.user.findAll();
    ctx.body = res;
  }
  // 查询单个
  async findUser() {
    const { ctx } = this;
    let res = await ctx.service.user.findUser();
    ctx.body = res;
  }
  // 删除单个
  async deleteUser() {
    const { ctx } = this;
    let res = await ctx.service.user.deleteUser();
    ctx.body = res;
  }

  // 更新数据
  async updateUser() {
    const { ctx } = this;
    let res = await ctx.service.user.updateUser();
    ctx.body = res;
  }
}

module.exports = UserController;