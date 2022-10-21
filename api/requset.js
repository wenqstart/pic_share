// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
import store from '@/store/index.js'
// 请求拦截器
$http.beforeRequest = function(options){
	uni.showLoading({
		title:'数据加载中...'
	})
	console.log(options);
	// 判断an当前请求的是否为有权限的接口
	// if(!store.state.user.userInfo.id || !store.state.user.userInfo.username){
	// 	uni.$showMsg('请登录后再执行此操作！')
	// }
	if(options.url.indexOf('/upload') !== -1){
		options.header = {
			'Content-Type':'multipart/form-data',
			'appId': '9de9402af49541a29d911e471ba6d7e4',
			'appSecret':'13926f7fe3c007edc436e95cd6f8a6dff9842'
		}
	}else{
		options.header = {
		     'appId': '9de9402af49541a29d911e471ba6d7e4        ',
		     'appSecret':'13926f7fe3c007edc436e95cd6f8a6dff9842'
		    }
	}

	
}

// 响应拦截器
$http.afterRequest = function(options){
	uni.hideLoading();
}

// http://47.107.52.7:88
// 请求的根路径
$http.baseUrl = 'http://47.107.52.7:88'

export default $http