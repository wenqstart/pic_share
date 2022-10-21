// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入vuex
import store from './store'
Vue.prototype.$store = store
Vue.config.productionTip = false

import API from '@/api/index.js';

uni.$API = API

// 封装弹窗的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
