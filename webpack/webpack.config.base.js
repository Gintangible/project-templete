//清空输出文件，多页面生成，多入口，公共js，sass、less ->css，压缩，按需更新，图片模块，缓存管理

'use strict';

const webpack = require("webpack");
const path = require("path");
const glob = require('glob');

//路径定义
const srcDir = path.resolve(process.cwd(), 'src');
const distDir = path.resolve(process.cwd(), 'dist');
const nodeModPath = path.resolve(__dirname, './node_modules');
const publicPath = '/';

//插件定义
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');//清空生成文件插件

//入口文件定义
const entries = function () {
    const jsDir = path.resolve(srcDir, 'js')
    const entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    const entry = {};

    for (let i = 0; i < entryFiles.length; i++) {
        const filePath = entryFiles[i];
        const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        entry[filename] = filePath;
    }
    return entry;
}

//html_webpack_plugins 定义 html
const html_plugins = function () {
    const entryHtml = glob.sync(srcDir + '/*.html')
    const htmls = []
    const entriesFiles = entries();

    entryHtml.forEach((page) => {
        const filePath = page;
        const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));

        const conf = {
            template:  filePath,
            filename: filename + '.html',
        }

        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body'
            conf.chunks = ['vendor', filename]
        }
        //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
        //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')

        htmls.push(new HtmlWebpackPlugin(conf))
    })

    return htmls;
}



module.exports = {
    entry: Object.assign(entries(), {
        // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
        'vendor': ["jquery"]
    }),

    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].[hash].js",
        chunkFilename: '[chunkhash:8].chunk.js',
        publicPath: publicPath
    },

    module: {
        rules: [

            {
                test: /\.js$/,
                // 这里表示忽略的文件夹，正则语法
                exclude: /node_modules/,
                loader: 'babel-loader'
            },

            {
                test: /\.css$/,//如何分离css
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "sass-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }

                    }
                ]
            },
            //pic
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    // resolve: {
    //     extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg'],
    //     root: [srcDir, nodeModPath],
    //     publicPath: '/'
    // },

    plugins: [

        //清除文件// 第一个参数是要清理的目录的字符串数组
        new CleanWebpackPlugin(['dist']),

        // 公共js
        new CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),


        ...html_plugins(),

        

        new ExtractTextPlugin('css/[name].css?[contenthash]')

    ]
}













