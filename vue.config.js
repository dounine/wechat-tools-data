const port = 8082
const { name } = require('./package.json')
module.exports = {
    devServer: {
        hot: true,
        port,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            "/api": {
                target: `http://192.168.1.182/api`,
                ws: true,
                changeOrigin: true, // 是否改变域名
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
        before: require('./mock/mock.js')
    },
    configureWebpack: {
        output: {
            library: `${name}`,
            libraryTarget: 'umd',
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/' : `/`
}