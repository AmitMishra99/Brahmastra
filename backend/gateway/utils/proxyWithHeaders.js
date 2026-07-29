const proxy = require("express-http-proxy");

const proxyWithHeader = (serviceURL) => {
  return proxy(serviceURL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq) proxyReqOpts.headers["x-user-id"] = srcReq.user.userID;
    },
  });
};

module.exports = proxyWithHeader;
