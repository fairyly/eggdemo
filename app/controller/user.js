'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async add() {
    this.ctx.body = this.ctx.service.user.add();
  }
}

module.exports = UserController;