// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }
  async login() {
    this.ctx.body = 'Hello login';
  }
}

module.exports = HomeController;