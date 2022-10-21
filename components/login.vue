<template>
	<div>
		<uni-nav-bar statusBar background-color="#39a17c" dark :fixed="true" shadow>
			<view class="navBar" slot="default">
				<view class="title">
					<span>{{title}}</span>
				</view>
			</view>
		</uni-nav-bar>
		<div class="login-container">

			<uni-icons type="contact" size="100"></uni-icons>
			<button class="btn-login" size="mini" @click="gotoLogin">一键登录</button>
			<view class="tips-text">登录后尽享更多权益</view>
		</div>
	</div>


</template>

<script>
	export default {
		name: 'login',
		props:['title'],
		methods: {
			gotoLogin() {
				uni.switchTab({
					url: '/pages/My/my'
				})
			}
		},
		mounted(){
			console.log('login');
		}
	}
</script>

<style lang="scss">
	.navBar {
		width: 100%;
		display: flex;
		/*居中对齐 每个项目两侧的间隔相等*/
		justify-content: space-around;
		align-content: center;
		padding-top: 12px;
	
		.title {
			font-size: 16px;
	
			.name {
				padding-bottom: 5rpx;
				border-bottom: 3px solid #fff;
			}
	
		}
		}
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		// 登录按钮的样式
		.btn-login {
			color: #59B091;
			border-radius: 100px;
			font-size: 40rpx;
			background-color: #fff;
			height: 100rpx;
			width: 70%;
			margin-bottom: 50rpx;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
