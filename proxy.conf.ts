const PROXY_CONFIG = [
  {
    context: '/api',
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    secure: false,
    "pathRewrite": {
      "^/api": ""
    },
  }
]

module.exports = PROXY_CONFIG