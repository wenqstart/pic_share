<template>
	<TkScreenScroll ref="children" :lengths="length" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
		<view class="container">
			<uni-nav-bar statusBar background-color="#39a17c" dark :fixed="true" shadow>
				<view class="navBar" slot="default" v-if="!isLogin">
					<view class="title">
						<span>首页</span>
					</view>
				</view>
				<view class="navBar" slot="default" v-else>

					<view class="title" @click="gotoFocus">
						<span :class="{'name':flag == 0}">关注</span>
					</view>
					<view class="title" @click="gotoCollect">
						<span :class="{'name':flag == 1}">收藏</span>
					</view>
					<view class="title" @click="gotoLike">
						<span :class="{'name':flag == 2}">点赞</span>
					</view>
				</view>

			</uni-nav-bar>
			<div class="card">
				<div class="card-item" v-for="item of imgList" :key="item.id">
					<uni-card>
						<template v-slot:title>
							<div>
								<uni-list>
									<uni-list-item :title="item.title">
										<template v-slot:header>
											<uni-icons type="fire" color="#F56C6C"></uni-icons>
										</template>
									</uni-list-item>
								</uni-list>
							</div>
						</template>
						<image @click="actionsComment(item)" style="width: 100%;height: 600rpx;border-radius: 10px;"
							:src="item.imageUrlList[0]"></image>
						<text class="uni-body uni-mt-5">{{item.content}}</text>

						<view slot="actions" class="card-actions">
							<view class="card-actions-item"
								@click="actionsCollect(item.id,item.hasCollect,item.collectId)">
								<text class="card-actions-item-text">{{item.collectNum}}</text>
								<uni-icons :type="item.hasCollect? 'star-filled' : 'star'" size="20"
									:color="item.hasCollect? '#F56C6C' : '#999'"></uni-icons>
								<text class="card-actions-item-text">收藏</text>
							</view>
							<view class="card-actions-item" @click="actionsLike(item.id,item.hasLike,item.likeId)">
								<text class="card-actions-item-text">{{item.likeNum}}</text>
								<uni-icons :type="item.hasLike? 'heart-filled' : 'heart'" size="20"
									:color="item.hasLike? '#F56C6C' : '#999'"></uni-icons>
								<text class="card-actions-item-text">点赞</text>
							</view>
							<view class="card-actions-item" @click="actionsComment(item)">
								<uni-icons type="chatbubble" size="20" color="#999"></uni-icons>
								<text class="card-actions-item-text">评论</text>
							</view>
						</view>
					</uni-card>
				</div>
			</div>


		</view>
	</TkScreenScroll>
</template>

<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			TkScreenScroll
		},
		props: {
			getFocusPicList: {
				type: Function,
				default: () => {},
			},
			getMyCollectList: {
				type: Function,
				default: () => {},
			},
			getMylikeList: {
				type: Function,
				default: () => {},
			},
			imgList: {
				type: Array,
				default: []
			},
			flag: {
				type: Number,
				default: 0
			},
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				length:3,
				tabsIndex:0
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
			isLogin() {
				if (this.userInfo.id && this.userInfo.username) {
					return true
				} else {
					return false
				}
			}
		},
		
		mounted() {
			console.log(this.userInfo);
			if (this.isLogin) {
				if (this.flag == 0) this.getFocusPicList()
				else if (this.flag == 1) this.getMyCollectList()
				else this.getMylikeList()
			}

		},

		methods: {
			toLeft(indexs){
				console.log(indexs);
			},
			toRight(indexs){
				console.log(indexs);
				uni.switchTab({
					url:'/pages/Find/find'
				})
			},
			// 获取索引值 
			getScreenIndes(indexs) {
				this.tabsIndex = indexs;
				if(indexs == 0){
					this.switchFocusPicList()
				}else if(indexs == 1){
					this.switchMyCollectList()
				}else{
					this.switchMylikeList()
				}
			},
			gotoFocus(){
				this.$refs.children.indexs = 0
				this.getScreenIndes(0)
			},
			gotoCollect(){
				this.$refs.children.indexs = 1
				this.getScreenIndes(1)
			},
			gotoLike(){
				this.$refs.children.indexs = 2
				this.getScreenIndes(2)
				
			},
			
			switchFocusPicList() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.$emit('clearImgList')
				this.getFocusPicList()
			},
			switchMyCollectList() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.$emit('clearImgList')
				this.getMyCollectList()
			},
			switchMylikeList() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})

				this.$emit('clearImgList')
				this.getMylikeList()
			},
			onClick(e) {
				console.log(e)
			},
			async actionsCollect(shareId, isCollect, collectId) {
				if (isCollect) {
					let res = await uni.$API.user.reqCancelCollect({
						collectId
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let result = await uni.$API.user.reqPicDetail({
							shareId,
							userId: this.userInfo.id
						})
						console.log(result);
						const {
							collectId,
							collectNum,
							hasCollect
						} = result.data.data
						this.$emit('changeCollectStatus', {
							shareId,
							collectId,
							collectNum,
							hasCollect
						})
					}
				} else {
					let res = await uni.$API.user.reqCollectPic({
						shareId,
						userId: this.userInfo.id
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let result = await uni.$API.user.reqPicDetail({
							shareId,
							userId: this.userInfo.id
						})
						console.log(result);
						const {
							collectId,
							collectNum,
							hasCollect
						} = result.data.data
						this.$emit('changeCollectStatus', {
							shareId,
							collectId,
							collectNum,
							hasCollect
						})
					}
				}

			},
			async actionsLike(shareId, isLike, likeId) {
				if (isLike) {
					let res = await uni.$API.user.reqCancelLike({
						likeId
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let result = await uni.$API.user.reqPicDetail({
							shareId,
							userId: this.userInfo.id
						})
						console.log(result);
						const {
							likeId,
							likeNum,
							hasLike
						} = result.data.data
						this.$emit('changeLikeStatus', {
							shareId,
							likeId,
							likeNum,
							hasLike
						})
					}
				} else {
					let res = await uni.$API.user.reqLikePic({
						shareId,
						userId: this.userInfo.id
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let result = await uni.$API.user.reqPicDetail({
							shareId,
							userId: this.userInfo.id
						})
						console.log(result);
						const {
							likeId,
							likeNum,
							hasLike
						} = result.data.data
						this.$emit('changeLikeStatus', {
							shareId,
							likeId,
							likeNum,
							hasLike
						})
					}
				}

			},
			async actionsComment(imgObj) {
				console.log(this.scrollTop);
				uni.setStorage({
					key: 'scrollTop',
					data: this.scrollTop
				})
				this.$emit('gotoDetail', imgObj)
			}

		}
	}
</script>

<style lang="scss">
	// .button {
	// 	display: flex;
	// 	flex-wrap: wrap;
	// 	/*居中对齐 每个项目两侧的间隔相等*/
	// 	justify-content: space-around;
	// 	margin-top: 100rpx;
	// 	overflow: hidden;

	// 	.login {
	// 		color: #59B091;
	// 		border-radius: 100px;
	// 		font-size: 40rpx;
	// 		background-color: #fff;
	// 		height: 100rpx;
	// 		width: 70%;
	// 		margin-bottom: 50rpx;
	// 	}
	// }


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

	.card {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;

		.card-item {
			width: 100%;

			.card-actions {
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin: 20rpx 0;
				padding: 20rpx 0;
				border-top: 0.5px solid #e2e2e2;

				.card-actions-item {
					.card-actions-item-text {
						font-size: 25rpx;
						color: #999;
						margin-right: 5rpx;
					}

					display: flex;
					justify-content: space-around;
					align-items: center;
				}

			}
		}

	}
</style>
