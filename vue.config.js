module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8080/waterOperation', //本地接口
        // target: 'http://172.19.0.131:8080/waterOperation',
        target: 'http://shuichang.xinglian.info/waterOperation', //线上接口
        // target: 'http://172.19.0.12:9002/waterOperation', //测试接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
