export default {
	namespaced: true,
	state: {
		// userInfo:JSON.parse(uni.getStorageInfoSync('userInfo') || '{}')
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}')
	},

	actions: {
		setUserInfo({
			commit
		}, data) {
			commit('SETUSERINFO', data)
		}
	},

	mutations: {
		SETUSERINFO(state, userInfo) {
			console.log(userInfo);
			state.userInfo = userInfo
			this.commit('user/saveUserInfoToStorage')

		},
		// 将 userinfo 持久化存储到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
	},

	getters: {

	}
}
