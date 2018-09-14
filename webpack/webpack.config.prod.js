// 引入基础配置文件
const webpackBase = require("./webpack.config.base");

const webpack = require("webpack");
//压缩代码
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");

// 合并配置文件
module.exports = webpackMerge(webpackBase, {
    plugins: [
        new UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});