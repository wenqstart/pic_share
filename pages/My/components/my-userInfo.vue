<template>
	<view class="wrap">
		<TkScreenScroll v-if="userShow == 0" :lengths="length" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
		<div class="userInfo">
			<view class="top-info">
				<view class="left">
					<view class="avatar">
						<image :src="userInfo.avatar == null ? '/static/avatar.jpeg' : userInfo.avatar"
							style="width:50px;height:50px" fade-show mode="widthFix"></image>
					</view>
					<view class="nick">
						<view class="name">
							<view class="userName">
								{{userInfo.username}}
							</view>
							<view class="sex">
								<view v-if="userInfo.sex == 0" class="sex">
									<image src="/static/male.jpg" style="width:20px;height:20px" fade-show
										mode="widthFix">
								</view>
								<view v-if="userInfo.sex == 1">
									<image src="/static/female.jpg" style="width:20px;height:20px">
								</view>
								<view v-if="userInfo.sex == 2">性别：未知</view>
							</view>
						</view>
						<view class="id">id:{{userInfo.id}}</view>
						<view class="id"><span>上次更新:{{userInfo.lastUpdateTime | formatDate}}</span></view>
						<view class="introduce"><span>简介:{{userInfo.introduce}}</span></view>
					</view>
				</view>

				<view class="right">
					<button size="mini" class="edit" @click="edit">编辑资料</button>
				</view>
			</view>
			<view class="main">
				<div class="title">
					<span :style="{'color':isDynamic ? 'black' : '#AFAFAF'}" @click="gotoDynamic">动态</span>
					<span :style="{'color':!isDynamic ? 'black' : '#AFAFAF'}" @click="gotoDraft">草稿</span>
				</div>
				<!-- <uni-section title="我的分享动态" type="line"> -->
				<div class="draft" v-if="isDynamic">
					<uni-list :border="true" class="imgList">
						<uni-list-chat @click="gotoDetail(imgObj)" clickable v-for="imgObj of imgList" :key="imgObj.id"
							:avatar-circle="true" extra-icon="trash" :title="imgObj.title"
							:avatar="(imgObj.imageUrlList == null || imgObj.imageUrlList.length == 0)? '/static/avatar.jpeg' : imgObj.imageUrlList[0]  "
							:note="imgObj.content">
							<view class="chat-custom-right">
								<text class="chat-custom-text">{{imgObj.createTime | formatDate}}</text>
								<!-- 需要使用 uni-icons 请自行引入 -->
								<view class="icon">
									<view class="delete" @click.stop="openDialog(imgObj.id)">
										<uni-icons class="trash" type="trash" color="#F56C6C" size="20"></uni-icons>
									</view>
									<view class="forward">
										<uni-icons type="forward" color="#69B197" size="20"> </uni-icons>
									</view>
								</view>
							</view>
						</uni-list-chat>
					</uni-list>

				</div>
				<div class="dynamic" v-else>
					<uni-list :border="true" class="imgList">
						<uni-list-chat @click="gotoDetail(imgObj)" clickable v-for="imgObj of draftList"
							:key="imgObj.id" :avatar-circle="true" extra-icon="trash" :title="imgObj.title"
							:avatar="(imgObj.imageUrlList == null || imgObj.imageUrlList.length == 0)? '/static/avatar.jpeg' : imgObj.imageUrlList[0]  "
							:note="imgObj.content">
							<view class="chat-custom-right">
								<text class="chat-custom-text">{{imgObj.createTime | formatDate}}</text>
								<!-- 需要使用 uni-icons 请自行引入 -->
								<view class="icon">
									<view class="delete" @click.stop="openDialog(imgObj.id)">
										<uni-icons class="trash" type="trash" color="#F56C6C" size="20"></uni-icons>
									</view>
									<view class="forward">
										<uni-icons type="forward" color="#69B197" size="20">
										</uni-icons>
									</view>

								</view>
							</view>
						</uni-list-chat>
					</uni-list>
				</div>
				<!-- </uni-section> -->
			</view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="warn" cancelText="取消" confirmText="确定" content="确认删除该动态吗？"
					@confirm="deleteDynamic"></uni-popup-dialog>
			</uni-popup>

			<uni-popup ref="alertDialog2" type="dialog">
				<uni-popup-dialog type="warn" cancelText="取消" confirmText="确定" content="确认发表该动态吗？"
					@confirm="sendDynamic"></uni-popup-dialog>
			</uni-popup>
		</div>
	</TkScreenScroll>
		<myPicDetail 
		v-else
		:isDynamic="isDynamic"
		:imgInfo="imgInfo" 
		:shareId="shareId" 
		:commentsList="commentsList"
		:commentsTotal="commentsTotal" 
		:getcommentList="getcommentList" 
		:getPicInfo="getPicInfo"
		@gotoDynamic="gotoDynamic"
		@refreshSecondCommentList="refreshSecondCommentList" 
		@setCurrent="setCurrent" 
		@gotoPicList="gotoUserInfo" />
	</view>
</template>

<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import myPicDetail from '@/components/myPicDetail.vue'
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index.js'
	export default {
		name: "my-userInfo",
		components: {
			myPicDetail,
			TkScreenScroll
		},
		props: {
			show: {
				type: Number,
				default: 0
			},
			imgNum: {
				type: Number,
				default: 0
			},
			draftNum: {
				type: Number,
				default: 0
			},
			commentPageNum: {
				type: Number,
				default: 1
			},
			imgList: {
				type: Array,
				default: () => []
			},
			draftList: {
				type: Array,
				default: () => []
			},
			getMySharePicList: {
				type: Function,
				default: () => {}
			},
			getMySaveDynamicList: {
				type: Function,
				default: () => {}
			},
			isDynamic: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				// 0 首页 1 动态详情
				shareId: '',
				userShow: 0,
				imgInfo: {},
				length:1,
				commentsList: [],
				commentsTotal: 0,
				currentId: 0,
				saveImgList: [],
			}
		},
		computed: {
			...mapState('user', ['userInfo'])
		},
		methods: {
			toLeft(indexs){
				console.log(indexs);
				uni.switchTab({
					url:'/pages/Send/send'
				})
			},
			toRight(indexs){
				console.log(indexs);
			},
			// 获取索引值
			getScreenIndes(indexs) {
				console.log(indexs);
			},
			setDynamic() {
				this.$emit('changeDynamic', false)
			},
			gotoDynamic() {
				this.userShow = 0
				this.$emit('changeDynamic', true)
				this.$emit('setShareList')
				this.getMySharePicList()
			},
			gotoDraft() {
				this.$emit('changeDynamic', false)
				this.$emit('setDraftList')
				this.getMySaveDynamicList()
			},
			refreshSecondCommentList(commentId, commentsSecond) {
				this.commentsList.forEach(item => {
					if (item.id == commentId)
						item.commentsSecond = commentsSecond
					item.isShowCommentTwo = true
				})
			},
			sendDynamic() {},
			async deleteDynamic() {
				let infoObj = {
					shareId: this.currentId,
					userId: this.userInfo.id
				}
				let res = await uni.$API.user.reqDeletePicShare(infoObj)
				console.log(res);
				if (res.data.code == 200) {
					if (this.isDynamic) {
						this.$emit('setShareList')
						this.getMySharePicList()
					} else {
						this.$emit('setDraftList')
						this.getMySaveDynamicList()
					}
				}
			},
			openDialog(id) {
				this.currentId = id
				this.$refs.alertDialog.open()
			},
			setCurrent() {
				this.$emit('setCurrent')
			},
			async getcommentList() {
				console.log('我的评论列表当前页', this.commentPageNum);
				let newObj = {
					shareId: this.shareId,
					current: this.commentPageNum,
					size: 6
				}
				let res = await uni.$API.user.reqGetFirstComment(newObj)
				console.log(res);
				if (res.data.code == 200) {
					let pages = Math.ceil(res.data.data.total / 6)
					if (this.commentPageNum == 1) {
						res.data.data.records.forEach(async (item) => {
							let infoObj = {
								shareId: item.shareId,
								commentId: item.id
							}
							let result = await uni.$API.user.reqGetSecondComment(infoObj)
							if (result.data.code == 200) {
								let commentsSecond = []
								if (result.data.data != null) {
									commentsSecond = result.data.data.records
								} else {
									commentsSecond = []
								}
								Vue.set(item, 'commentsSecond', commentsSecond)
								Vue.set(item, 'isShowCommentTwo', false)
							}
						})
						this.commentsList = res.data.data.records
					} else if (this.commentPageNum <= pages) {
						res.data.data.records.forEach(async (item) => {
							let infoObj = {
								shareId: item.shareId,
								commentId: item.id
							}
							let result = await uni.$API.user.reqGetSecondComment(infoObj)
							console.log(result);
							if (result.data.code == 200) {
								let commentsSecond = []
								if (result.data.data != null) {
									commentsSecond = result.data.data.records
								} else {
									commentsSecond = []
								}
								Vue.set(item, 'commentsSecond', commentsSecond)
								Vue.set(item, 'isShowCommentTwo', false)
							}
						})
						this.commentsList = [...this.commentsList, ...res.data.data.records]
					}
					this.commentsTotal = res.data.data.total
				}
			},
			async getPicInfo() {
				let res = await uni.$API.user.reqPicDetail({
					shareId: this.shareId,
					userId: this.userInfo.id
				})
				console.log(res);
				this.userShow = 1
				this.$emit('changeShow', this.userShow)
				if (res.data.code == 200) {
					this.imgInfo = res.data.data
					// this.userShow = 1
					// this.$emit('changeShow', this.userShow)
					return this.imgInfo
				} else {
					return {}
				}
			},
			gotoUserInfo() {
				this.userShow = 0
				this.commentsList = []
				this.$emit('changeShow', this.userShow)
				this.$emit('setCommentPageNum')
			},
			// 去动态详情
			gotoDetail(imgObj) {
				this.shareId = imgObj.id
				this.getPicInfo()
				this.getcommentList()
			},
			// 编辑资料
			edit() {
				this.$emit('change', 3)
			},

		},
		onLoad() {
			this.userShow = this.show
		},
		//时间戳的处理    
		filters: {
			formatDate: function(value) {
				var date = new Date();
				date.setTime(value);
				var month = date.getMonth() + 1;
				var hours = date.getHours();
				if (hours < 10)
					hours = "0" + hours;
				var minutes = date.getMinutes();
				if (minutes < 10)
					minutes = "0" + minutes;
				var time = date.getFullYear() + "-" + month + "-" + date.getDate() +
					" " + hours + ":" + minutes;
				return time;
			}

		}
	}
</script>

<style lang="scss">
	// /deep/.file-picker__box {
	// 	background-color: #F5F5F5;
	// }

	.wrap {
		.top-info {
			position: relative;
			margin-top: 30rpx;

			.left {
				display: flex;
				justify-content: space-around;

				.nick {
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;
					align-content: space-around;

					.name {
						font-size: 50rpx;
						display: flex;
						align-items: center;
					}

					.id {
						font-size: 23rpx;
						padding-top: 20rpx;
					}

					.introduce {
						font-size: 23rpx;
						padding-top: 20rpx;
					}
				}
			}

			.right {
				position: absolute;
				left: 20rpx;
				top: 140rpx;

				.edit {
					color: #fff;
					border-radius: 100px;
					font-size: 30rpx;
					background-color: #69B197;
					height: 70rpx;
					width: 250rpx;
					margin-bottom: 50rpx;
				}
			}
		}

		.main {
			margin-top: 60rpx;

			.title {
				display: flex;
				justify-content: space-around;
				background-color: #fff;
				padding: 15rpx;
				color: #000;
				border: 1px solid #fff;
				border-top-left-radius: 60rpx;
				border-top-right-radius: 60rpx;
			}

			.imgList {
				display: flex;
				padding-left: 10rpx;

				.chat-custom-right {
					flex: 1;
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-end;

					.chat-custom-text {
						font-size: 12px;
						color: #999;
					}

					.icon {
						display: flex;
						justify-content: space-around;

						.trash {
							margin-right: 20rpx;
						}
					}
				}



				.imgItem {
					image {
						width: 100rpx;
						height: 100rpx;
					}
				}
			}
		}
	}
</style>
