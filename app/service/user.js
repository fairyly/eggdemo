'use strict';

const Service = require('egg').Service;
class UserService extends Service {
  // 更新用户信息
  async add() {
    const {
      ctx,
    } = this;
    const result = await ctx.model.User.create({
      userName: 'test',
    });
    return result;
  }
}
module.exports = UserService;