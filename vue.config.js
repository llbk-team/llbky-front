const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 포트번호 변경
  devServer: {
    port: 80,
  },

  // 🔥 ffmpeg.wasm 경고 제거
  configureWebpack: {
    ignoreWarnings: [
      {
        module: /@ffmpeg\/ffmpeg/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ],
  },
});