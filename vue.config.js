module.exports = {
	publicPath: './',
	productionSourceMap: false,
	devServer: {
		proxy: {
			'/test': {
				target: "http://192.168.11.30:8182",//这个是你要访问得接口地址
				changeOrigin: true,
				pathRewrite: {//重写地址  比如说 你的接口地址是'http://10.10.1.10/system/getUserInfo ' 你请求得时候地址只需要写'/test/getUserInfo'
					'/test': ''  
				}
			}
		}
	}
}