const path = require('path');

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@components-learn': path.resolve(__dirname, 'src/components-learn'),
    },
  },
};
