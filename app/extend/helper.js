/**
 * 生成 Token
 * @param {Object} data
 * 使用 await ctx.helper.createToken(ctx, data)
 */

exports.createToken = async (ctx, data) => {
  return ctx.app.jwt.sign(data, ctx.app.config.jwt.secret, {
    expiresIn: "200h"
  });
}

/**
 * 验证token的合法性
 * @param {String} token
 */
exports.verifyToken= async (ctx, token) => {
  return new Promise((resolve, reject) => {
    ctx.app.jwt.verify(token, ctx.app.config.jwt.secret, function(err, decoded) {
      let result = {};
      if (err) {
        /*
          err = {
            name: 'TokenExpiredError',
            message: 'jwt expired',
            expiredAt: 1408621000
          }
        */
        result.verify = false;
        result.message = err.message;
      } else {
        result.verify = true;
        result.message = decoded;
      }
      resolve(result);
    });
  });
}

// 处理成功响应
exports.success = (ctx, result = null, message = "请求成功", status = 200) => {
  ctx.body = {
    code: 0,
    message: message,
    data: result
  };
  ctx.status = status;
};

// 处理失败响应
exports.error = (ctx, code, message) => {
  ctx.body = {
    code: code,
    message: message
  };
  ctx.status = code;
};


exports.formatDate = (date) => {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  if (m < 10 ) {
    m = '0' + m;
  }
  let d = date.getDate();
  if (d < 10 ) {
    d = '0' + d;
  }
  let h = date.getHours();
  if (h < 10 ) {
    h = '0' + h;
  }
  let min = date.getMinutes();
  if (min < 10 ) {
    min = '0' + min;
  }
  let s = date.getSeconds();
  if (s < 10 ) {
    s = '0' + s;
  }

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

exports.formatYmd = (date) => {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  if (m < 10 ) {
    m = '0' + m;
  }
  let d = date.getDate();
  if (d < 10 ) {
    d = '0' + d;
  }
  let h = date.getHours();
  if (h < 10 ) {
    h = '0' + h;
  }
  let min = date.getMinutes();
  if (min < 10 ) {
    min = '0' + min;
  }
  let s = date.getSeconds();
  if (s < 10 ) {
    s = '0' + s;
  }

  return `${y}-${m}-${d}`;
}