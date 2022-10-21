<template>
	<div>
		<uni-nav-bar dark :fixed="true" shadow background-color="#39a17c" status-bar left-icon="left"
			@clickLeft="back()" />
		<div class="top-info">
			<div class="left-info">
				<view class="avatar">
					<image src="/static/avatar.jpeg" style="width:50px;height:50px" fade-show mode="widthFix"></image>
				</view>
				<div class="nick">
					<div class="userName">{{imgInfo.username || 'Tom'}}</div>
					<div class="time">{{imgInfo.createTime | formatDate}}</div>
				</div>

			</div>
			<div class="right-info">
				<view class="toSend" v-if="isDynamic">
					<uni-icons type="checkmarkempty" size="20" color="#59B091"></uni-icons>
					<span>已发表</span>
				</view>
				<view class="alSend" v-else>
					<uni-icons type="paperplane" size="20" color="#59B091"></uni-icons>
					<span>待发表</span>
				</view>

			</div>
		</div>

		<uni-swiper-dot class="uni-swiper-dot-box" :info="imgInfo.imageUrlList" :current="current" mode="round"
			:dotsStyles="{
						backgroundColor: 'rgba(255, 90, 95,0.3)',
						border: '1px rgba(255, 90, 95,0.3) solid ',
						color: '#fff',
						selectedBackgroundColor: 'rgba(255, 90, 95,0.9)',
						selectedBorder: '1px rgba(255, 90, 95,0.9) solid'
					}">
			<swiper class="swiper-box" @change="change" :current="current">
				<swiper-item v-for="(imgUrl, index) in imgInfo.imageUrlList" style="height: 1000px;" :key="index">
					<view class="swiper-item">
						<image
							:src="imgInfo == {} || imgInfo.imageUrlList == null || imgInfo.imageUrlList.length == 0 ? '/static/view.jpg' :imgUrl"
							style="width: 100%" fade-show mode="aspectFill"></image>
					</view>

				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<TkScreenScroll :lengths="length" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
			<view slot="actions" class="card-actions">
				<view class="card-actions-item"
					@click="actionsCollect(imgInfo.id,imgInfo.hasCollect,imgInfo.collectId)">
					<text class="card-actions-item-text">{{imgInfo.collectNum}}</text>
					<uni-icons :type="imgInfo.hasCollect? 'star-filled' : 'star'" size="20"
						:color="imgInfo.hasCollect? '#F56C6C' : '#999'"></uni-icons>
					<text class="card-actions-item-text">收藏</text>
				</view>
				<view class="card-actions-item" @click="actionsLike(imgInfo.id,imgInfo.hasLike,imgInfo.likeId)">
					<text class="card-actions-item-text">{{imgInfo.likeNum}}</text>
					<uni-icons :type="imgInfo.hasLike? 'heart-filled' : 'heart'" size="20"
						:color="imgInfo.hasLike? '#F56C6C' : '#999'"></uni-icons>
					<text class="card-actions-item-text">点赞</text>
				</view>
				
			</view>
			<h3 class="title">{{imgInfo.title}}</h3>
			<div class="content">{{imgInfo.content}}</div>
			<div class="edit">
				<uni-icons v-show="!isDynamic" type="compose" size="25" color="#59B091" @click="openDialog"></uni-icons>
			</div>

			<div class="comment">
				<div class="commentTitle">
					<span>评论{{commentsTotal}}</span>
				</div>
				<uni-list :border="true" class="imgList" v-for="comment of commentsList" :key="comment.id">
					<uni-list-chat :avatar-circle="true" :title="comment.userName" avatar="/static/avatar.jpeg"
						:note="comment.content">
						<view class="chat-custom-right">
							<text class="chat-custom-text">{{comment.createTime}}</text>
							<!-- 需要使用 uni-icons 请自行引入 -->
							<view class="reply">
								<uni-icons class="icon" type="top" color="#69B197" size="20"
									v-if="comment.isShowCommentTwo"
									@click="comment.isShowCommentTwo = !comment.isShowCommentTwo"></uni-icons>
								<uni-icons class="icon" type="bottom" color="#69B197" size="20"
									@click="comment.isShowCommentTwo = !comment.isShowCommentTwo" v-else></uni-icons>
								<span class="myReply"
									@click="comment.isShowCommentTwo = !comment.isShowCommentTwo">更多回复</span>
								<uni-icons class="icon" type="chat" color="#69B197" size="20"
									@click="replyUser(comment)">
								</uni-icons>
								<span class="myReply" @click="replyUser(comment)">回复</span>
							</view>
						</view>
					</uni-list-chat>
					<view class="commentSecond" v-show="comment.isShowCommentTwo">
						<uni-list border-full>
							<uni-list-item v-for="item of comment.commentsSecond" :key="item.id" :title="item.userName"
								:note="item.content" :rightText="item.createTime" />
						</uni-list>
					</view>
				</uni-list>
			</div>
			<view class="bottom">
				<view class="comInput">
					<uni-search-bar v-if="isDynamic" v-model="myComment" bgColor="#fff" placeholder="发表评论"
						@confirm="comment" cancelButton="none" clearButton="always">
						<uni-icons slot="searchIcon" color="#999999" size="18" type="chatbubble" />
						<button type="primary">发表</button>
					</uni-search-bar>
					<view class="button" v-else>
						<button type="default" class="send" @click="changeSaveToSend">发表</button>
					</view>
				</view>
			</view>
			<view>
				<uni-popup ref="reply" type="bottom">
					<view class="pop">
						<uni-easyinput class="input" focus trim="all" v-model="myCommentTwo" placeholder="请输入内容"
							@blur="hideKeyborad" @confirm="reply"></uni-easyinput>
					</view>
				</uni-popup>
				<uni-popup ref="content" type="center">
					<uni-popup-dialog ref="inputClose" mode="input" title="修改内容" @confirm="editInfo">
						<view class="pop">
							<uni-forms :modelValue="contentData" label-position="center">
								<uni-forms-item required label="标题">
									<uni-easyinput type="text" v-model="contentData.title" placeholder="请输入标题"
										@blur="hideKeyborad" />
								</uni-forms-item>
								<uni-forms-item required label="内容">
									<uni-easyinput type="textarea" v-model="contentData.content" placeholder="请输入内容"
										@blur="hideKeyborad" />
								</uni-forms-item>
							</uni-forms>
						</view>
					</uni-popup-dialog>
				</uni-popup>
			</view>
		</TkScreenScroll>
	</div>
</template>

<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		name: "myPicDetail",
		components: {
			TkScreenScroll
		},
		props: {
			imgList: {
				type: Array,
				default: () => {
					return []
				}
			},
			isDynamic: {
				type: Boolean,
				default: true
			},
			commentsList: {
				type: Array,
				default: () => {
					return []
				}
			},
			commentsTotal: {
				type: Number,
				default: 0
			},
			shareId: {
				type: String,
				default: ''
			},
			imgInfo: {
				type: Object,
				default: () => {
					return {}
				}
			},
			getPicInfo: {
				type: Function,
				default: () => {}
			},
			getcommentList: {
				type: Function,
				default: () => {}
			},
		},
		computed: {
			...mapState('user', ['userInfo']),
			isMyself() {
				return this.userInfo.id == this.imgInfo.pUserId
			}
		},
		data() {
			return {
				myComment: '',
				current: 0,
				isFocus: false,
				length: 1,
				myCommentTwo: '',
				currentCommentId: 0,
				currentCommentUserId: 0,
				windowHeight: '',
				contentData: {
					title: '',
					content: ''
				}
			}
		},
		methods: {
			// 获取索引值
			getScreenIndes(indexs) {
				this.tabsIndex = indexs;
				console.log(indexs);
			},
			toLeft(indexs) {
				console.log('到左边',indexs);
				this.back()
			},
			toRight(indexs) {
				console.log('到右边',indexs);
			},
			// 确定修改
			editInfo() {
				this.title = this.contentData.title
				this.content = this.contentData.content
			},
			// 打开编辑框
			openDialog() {
				this.$refs.content.open()
			},
			// 将保存状态修改为发布状态
			async changeSaveToSend() {
				let newObj = {
					title: this.contentData.title,
					content: this.contentData.content,
					id: this.imgInfo.id,
					imageCode: this.imgInfo.imageCode,
					pUserId: this.imgInfo.pUserId
				}
				let res = await uni.$API.user.reqChangeStatus(newObj)
				console.log(res);
				if (res.data.code == 200) {
					uni.$showMsg('发表成功！')
					// 去我的动态
					this.$emit('gotoDynamic')
				}
			},
			// 隐藏键盘
			hideKeyborad() {
				uni.hideKeyboard()
			},
			// 确定发表二级评论
			async reply() {
				// console.log('二级评论', this.myCommentTwo);
				let newObj = {
					content: this.myCommentTwo,
					parentCommentId: this.currentCommentId,
					parentCommentUserId: this.currentCommentUserId,
					replyCommentId: this.currentCommentId,
					replyCommentUserId: this.currentCommentUserId,
					shareId: this.shareId,
					userId: this.userInfo.id,
					userName: this.userInfo.username
				}
				let res = await uni.$API.user.reqAddSecondComment(newObj)
				// console.log(res);
				if (res.data.code == 200) {
					this.myCommentTwo = ''
					uni.hideKeyboard()
					this.$refs.reply.close()
					let infoObj = {
						shareId: this.shareId,
						commentId: this.currentCommentId
					}
					let result = await uni.$API.user.reqGetSecondComment(infoObj)
					// console.log(result);
					if (result.data.code == 200) {
						let commentsSecond = result.data.data.records
						this.$emit('refreshSecondCommentList', this.currentCommentId, commentsSecond)
					}
				}
			},
			// 点击回复按钮
			replyUser(comment) {
				this.$refs.reply.open('bottom')
				this.isFocus = true
				this.currentCommentId = comment.id
				this.currentCommentUserId = comment.pUserId
			},
			// 图片轮播图切换
			change(e) {
				this.current = e.detail.current
			},
			// 发表评论
			async comment(e) {
				console.log(e);
				this.$emit('setCurrent')
				let newObj = {
					content: this.myComment,
					shareId: this.shareId,
					userId: this.userInfo.id,
					userName: this.userInfo.username
				}
				let res = await uni.$API.user.reqAddFirstComment(newObj)
				console.log(res);
				if (res.data.code == 200) {
					this.getcommentList()
				}
				this.myComment = ''
			},
			// 返回
			back() {
				this.$emit('gotoPicList')
			},
			// 收藏
			async actionsCollect(shareId, isCollect, collectId) {
				if (isCollect) {
					let res = await uni.$API.user.reqCancelCollect({
						collectId
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let imgInfo = await this.getPicInfo()
						const {
							collectId,
							collectNum,
							hasCollect
						} = imgInfo
						if (!this.isMyself) this.$emit('changeCollectStatus', {
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
						let imgInfo = await this.getPicInfo()
						const {
							collectId,
							collectNum,
							hasCollect
						} = imgInfo
						if (!this.isMyself) this.$emit('changeCollectStatus', {
							shareId,
							collectId,
							collectNum,
							hasCollect
						})
					}
				}

			},
			// 点赞
			async actionsLike(shareId, isLike, likeId) {
				if (isLike) {
					let res = await uni.$API.user.reqCancelLike({
						likeId
					})
					console.log(res.data);
					if (res.data.code == 200) {
						let imgInfo = await this.getPicInfo()
						const {
							likeId,
							likeNum,
							hasLike
						} = imgInfo
						if (!this.isMyself) this.$emit('changeLikeStatus', {
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
						let imgInfo = await this.getPicInfo()
						const {
							likeId,
							likeNum,
							hasLike
						} = imgInfo
						if (!this.isMyself) this.$emit('changeLikeStatus', {
							shareId,
							likeId,
							likeNum,
							hasLike
						})
					}
				}

			},

		},
		mounted() {
			this.contentData = this.imgInfo
			uni.getSystemInfo({
				success: (res) => {
					console.log(res);
					this.windowHeight = res.windowHeight;
				}
			});

			uni.onWindowResize((res) => {
				console.log(res);
				if (res.size.windowHeight < this.windowHeight) {
					uni.hideTabBar();
				} else {
					uni.showTabBar();
				}
			})
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
	.swiper-box {
		height: 500rpx;

		.swiper-item {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 500rpx;
			color: #fff;
		}
	}

	.top-info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx;
		// align-content: center;

		.left-info {
			display: flex;
			justify-content: space-between;

			.nick {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin-left: 20rpx;

				.time {
					font-size: 14rpx;
					color: #a3a3a3;
				}
			}

		}

		.right-info {
			span {
				font-style: italic;
			}

			.focus {
				border: 1px solid #59B091;
				color: #59B091;
				border-radius: 20px;
				background-color: #fff;
				height: 60rpx;
				width: 170rpx;
			}
		}
	}

	.title {
		color: #333333;
		margin-left: 20rpx;
	}

	.content {
		color: #383838;
		margin-left: 20rpx;
		margin-bottom: 100rpx;
	}

	.edit {
		float: right;
		margin-right: 30rpx;
	}

	.comment {
		padding-bottom: 100rpx;

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

			.reply {
				display: flex;
				justify-content: space-around;
				align-items: center;

				.myReply {
					font-size: 23rpx;
					margin-right: 10rpx;
				}

				.icon {
					margin-right: 20rpx;
				}
			}
		}

		.commentTitle {
			width: 100%;
			margin-left: 20rpx;
			color: #a3a3a3;
			padding: 20rpx 0;
			border-bottom: 0.5px solid #e2e2e2;
		}

		.commentsList {
			.comment-item {
				display: flex;
				justify-content: space-around;
				align-items: center;

				.comment-left {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}

				.comment-right {
					display: flex;
					align-items: flex-start;

					.create-time {
						font-size: 14rpx;
						color: #a3a3a3;
					}
				}
			}

		}
	}

	.bottom {
		position: fixed;
		width: 100%;
		height: 100rpx;
		bottom: 0;
		background-color: #fff;
		z-index: 999;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.comInput {
			width: 100%;

			.button {
				margin: 0 10rpx 20rpx;

				.send {
					background-color: #59B091;
					background-image: linear-gradient(90deg, #6fdcb4, #59B091);
					// background: linear-gradient('#6fdcb4','#59B091');
					padding: 5rpx;
					color: #fff;
					border: 1px solid #fff;
					border-radius: 60rpx;
				}
			}
		}

		.send {}
	}



	.pop {
		width: 100%;
		// height: 120rpx;
		background-color: #FFFFFF;
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;

		.input {
			padding: 0 10rpx;
		}
	}

	.card-actions {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 0;
		padding: 20rpx 0;
		border-bottom: 0.5px solid #e2e2e2;

		.card-actions-item {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.card-actions-item-text {
				font-size: 25rpx;
				color: #999;
				margin-right: 5rpx;
			}

		}

	}
</style>
