<template>
	<div>
		<TkScreenScroll lengths="1" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff">
				<view class="popup-content"><text class="text">版本号：1.0.0</text></view>
			</uni-popup>
		</view>
		<uni-section title="我的" type="line"></uni-section>
		<uni-card :is-shadow="false" @click="changeFlag(2)" is-full>
			<text class="uni-h5">个人主页</text>
		</uni-card>
		<uni-card :is-shadow="true" shadow="0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.08)" @click="changeFlag(3)" is-full>
			<text class="uni-h5">修改资料</text>
		</uni-card>
		<uni-section title="账号" type="line"></uni-section>
		<uni-card :is-shadow="false" @click="changeFlag(0)" is-full>
			<text class="uni-h5">注册账号</text>
		</uni-card>
		<uni-card :is-shadow="true" shadow="0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.08)" @click="changeFlag(1)" is-full>
			<text class="uni-h5">切换账号</text>
		</uni-card>
		<uni-section title="版本" type="line"></uni-section>
		<uni-card :is-shadow="false" shadow="0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.08)" @click="aboutUs" is-full>
			<text class="uni-h5">关于我们</text>
		</uni-card>
		<view class="button">
			<button class="submit" @click="logOut(1)">退出登录</button>
		</view>
		</TkScreenScroll>
	</div>
</template>

<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import store from '@/store/index.js'
	export default {
		name: "my-setting",
		components:{
			TkScreenScroll
		},
		methods: {
			toLeft(indexs){
				console.log(indexs);
				this.$emit('change',2)
			},
			toRight(indexs){
				console.log(indexs);
			},
			// 获取索引值
			getScreenIndes(indexs) {
				console.log(indexs);
			},
			changeFlag(flag){
				store.dispatch('user/setUserInfo', {})
				this.$emit('change',flag)
			},
			logOut(flag) {
				// 询问用户是否退出登录
				uni.showModal({
					title: '提示',
					content: '确认退出登录吗？'
				}).then(res => {
					if (res[1] && res[1].confirm) {
						// 用户确认了退出登录的操作
						// 需要清空 vuex 中的 userinfo
						store.dispatch('user/setUserInfo', {})
						console.log(store.state);
						this.$emit('change', flag)
					}
				}).catch(err => err)
			},
			aboutUs() {
				this.$refs.popup.open('bottom')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 200px;
	}

	.button {
		display: flex;
		flex-wrap: wrap;
		/*居中对齐 每个项目两侧的间隔相等*/
		justify-content: space-around;
		margin-top: 100rpx;
		overflow: hidden;

		.submit {
			color: #fff;
			border-radius: 100px;
			font-size: 40rpx;
			background-color: #59B091;
			height: 100rpx;
			width: 70%;
		}
	}
</style>
