<template>
	<div class="wrapper">
		<h1 class="title">SIGN UP</h1>
		<view class="input">
			<input class="user" type="text" v-model="username" placeholder-style="color: #39a17c;"
				placeholder="用户名"></input>
			<input class="user" type="password" v-model="password" placeholder-style="color: #39a17c;"
				placeholder="输入密码"></input>
			<input class="user" type="password" v-model="passwordConfirm" placeholder-style="color: #39a17c;"
				placeholder="确认密码"></input>
		</view>

		<view class="pic">
			<image src="/static/register.png" class="person"></image>

		</view>

		<view class="button">
			<button size="mini" class="register" @click="register">注册</button>
			<view @click="gotoLogin">已有账号？去登录</view>
		</view>
	</div>
</template>
<script>
	export default {
		name: 'my-register',
		data() {
			return {
				username: '',
				password: '',
				passwordConfirm: ''
			}

		},
		onLoad() {},
		onReady() {},
		methods: {
			// 注册
			async register() {
				const {
					username,
					password,
					passwordConfirm
				} = this
				if (password !== passwordConfirm) {
					return uni.$showMsg('两次输入的密码不一致！')
				}
				let registerInfo = {
					username,
					password
				}
				let res = await uni.$API.user.reqRegister(registerInfo)
				console.log(res);
				if (res.data.code == 200) {
					uni.$showMsg('注册成功！')
					this.username = ''
					this.password = ''
					this.passwordConfirm = ''
					this.$emit('change', 1)
				} else {
					uni.$showMsg(res.data.msg)
				}
			},
			gotoLogin() {
				this.$emit('change', 1)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #59B091;
		color: #fff;
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
				margin: 10px auto;
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
			margin-top: 45rpx;
			overflow: hidden;

			.register {
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
