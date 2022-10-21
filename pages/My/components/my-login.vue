<template>
	<div class="wrapper">
		<h1 class="title">SIGN IN</h1>
		<view class="input">
			<input class="user" type="text" v-model="username" placeholder-style="color: #39a17c;"
				placeholder="用户名"></input>
			<input class="user" type="password" v-model="password" placeholder-style="color: #39a17c;"
				placeholder="密码"></input>
				
		</view>

		<view class="pic">
			<image src="/static/login.png" class="person"></image>
		</view>

		<view class="button">
			<button size="mini" class="login" @click="login">登录</button>
			<view @click="gotoRegister">还没账号？去注册</view>
		</view>
		
	
	</div>
</template>
<script>
	import store from '@/store/index.js'
	export default {
		name: "my-login",
		data() {
			return {
				username: '',
				password: '',
			}
		},
		
		methods: {
			async login() {
				const {
					username,
					password
				} = this
				let loginInfo = {
					username,
					password
				}
				let res = await uni.$API.user.reqLogin({
					username,
					password
				})
				// if (1) {
				if (res.data.code == 200) {
					uni.$showMsg('登录成功！')
					console.log(res.data.data,password);
					let userInfo = res.data.data
					userInfo.password = password
					store.dispatch('user/setUserInfo', userInfo)
					this.$emit('change',2)

				} else {
					uni.$showMsg(res.data.msg)
				}
			},
			gotoRegister(){
				this.$emit('change',0)
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		margin: 0;
		padding: 0;
	}

	.wrapper {
		.title {
			text-align: center;
			margin: 30rpx 0;
			
		}

		.input {
			display: flex;
			flex-direction: column;

			.user {
				font-size: 30rpx;
				width: 70%;
				border-radius: 100px;
				margin: 20px auto;
				padding: 30rpx 0 30rpx 30rpx;
				background-color: #fff;
			}
		}

		.pic {
			display: flex;
			justify-content: center;

			.person {
				height: 300rpx;
				width: 300rpx;
				margin: 20rpx 10rpx 0;
			}
		}

		.button {
			display: flex;
			flex-wrap: wrap;
			/*居中对齐 每个项目两侧的间隔相等*/
			justify-content: space-around;
			margin-top: 100rpx;
			overflow: hidden;

			.login {
				color: #59B091;
				border-radius: 100px;
				font-size: 40rpx;
				background-color: #fff;
				height: 100rpx;
				width: 70%;
				margin-bottom: 50rpx;
			}
		}
	}
</style>
