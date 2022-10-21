<template>
	<view class="container">
		<picList v-if="show == 0" :getFocusPicList="getFocusPicList" :getMyCollectList="getMyCollectList"
			:getMylikeList="getMylikeList" :imgList="imgList" :flag="flag" @changeCollectStatus="changeCollectStatus"
			@changeLikeStatus="changeLikeStatus" @clearImgList="clearImgList" :scrollTop="scrollTop"
			@gotoDetail="gotoDetail" />
		<picDetail v-else-if="show == 1" :imgInfo="imgInfo" :shareId="shareId" :commentsList="commentsList"
			:commentsTotal="commentsTotal" :getPicInfo="getPicInfo" :getcommentList="getcommentList"
			@refreshSecondCommentList="refreshSecondCommentList" @changeCollectStatus="changeCollectStatus"
			@changeLikeStatus="changeLikeStatus" @setCurrent="setCurrent" @gotoPicList="gotoPicList" />
		<login v-else title="首页" />
	</view>

</template>
<script>
	import picList from './picList.vue'
	import picDetail from '@/components/picDetail.vue'
	import login from '@/components/login.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			picList,
			picDetail,
			login
		},
		computed: {
			...mapState('user', ['userInfo'])
		},
		watch: {
			userInfo(newValue, oldValue) {
				if (this.userInfo.id && this.userInfo.username) {
					this.show = 0
				} else {
					this.show = 2
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		mounted() {
			console.log(this.userInfo);
			if (this.userInfo.id && this.userInfo.username) {
				this.show = 0
			} else {
				this.show = 2
			}
		},

		data() {
			return {
				imgList: [],
				flag: 0,
				show: 0,
				shareId: '',
				scrollTop: 0,
				imgInfo: {},
				picInfo: {},
				focusPageNum: 1,
				collectPageNum: 1,
				likePageNum: 1,
				commentPageNum: 1,
				commentsList: [],
				commentsTotal: 0,
				isloading: false
			}
		},

		methods: {
			refreshSecondCommentList(commentId, commentsSecond) {
				this.commentsList.forEach(item => {
					if (item.id == commentId)
						item.commentsSecond = commentsSecond
					item.isShowCommentTwo = true
				})
			},
			changeCollectStatus({
				shareId,
				collectId,
				collectNum,
				hasCollect
			}) {
				this.imgList.forEach(item => {
					if (item.id == shareId) {
						item.hasCollect = hasCollect
						item.collectId = collectId
						item.collectNum = collectNum

					}
				})
			},
			changeLikeStatus({
				shareId,
				likeId,
				likeNum,
				hasLike
			}) {
				this.imgList.forEach(item => {
					if (item.id == shareId) {
						item.hasLike = hasLike
						item.likeId = likeId
						item.likeNum = likeNum
					}
				})
			},
			setCurrent() {
				this.commentPageNum = 1
			},
			clearImgList() {
				this.imgList = []
				this.focusPageNum = 1
				this.collectPageNum = 1
				this.likePageNum = 1
			},
			gotoDetail(imgObj) {
				console.log(imgObj);
				this.picInfo = imgObj
				this.shareId = imgObj.id
				this.getPicInfo()
				this.getcommentList()
			},
			async getPicInfo() {
				let res = await uni.$API.user.reqPicDetail({
					shareId: this.shareId,
					userId: this.userInfo.id
				})
				console.log(res);
				if (res.data.code == 200) {
					let newObj = res.data.data
					newObj.imageUrlList = this.picInfo.imageUrlList
					newObj.username = this.picInfo.username
					this.imgInfo = newObj
					this.show = 1
					return newObj
				} else {
					return {}
				}
			},
			gotoPicList() {
				this.commentsList = []
				this.commentPageNum = 1
				// this.imgList = []
				// this.collectPageNum = 1
				// this.likePageNum = 1
				// if (this.flag == 0) this.getFocusPicList()
				// else if (this.flag == 1) this.getMyCollectList()
				// else this.getMylikeList()
				this.show = 0
				uni.getStorage({
					key: 'scrollTop',
					success(res) {
						console.log(res);
						if (!isNaN(res.data)) {
							uni.pageScrollTo({
								scrollTop: res.data,
								duration: 0
							})
						}
					}
				})
			},
			async getcommentList() {
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
					console.log(this.commentsList);
					this.commentsTotal = res.data.data.total
				}
			},
			async getFocusPicList() {
				this.isloading = true
				this.flag = 0
				const {
					userInfo
				} = this
				let newObj = {
					id: userInfo.id,
					current: this.focusPageNum,
					size: 3
				}
				let res = await uni.$API.user.reqGetFocusList(
					newObj
				)
				this.isloading = false
				console.log(res);
				if (res.data.code == 200) {
					uni.stopPullDownRefresh();
					this.imgList = [...this.imgList, ...res.data.data.records]
				} else {
					uni.stopPullDownRefresh();
				}
			},
			async getMyCollectList() {
				this.isloading = true
				this.flag = 1
				const {
					userInfo
				} = this
				let newObj = {
					id: userInfo.id,
					current: this.collectPageNum,
					size: 3
				}
				let res = await uni.$API.user.reqGetPicCollectionList(
					newObj
				)
				this.isloading = false
				console.log(res);
				if (res.data.code == 200) {
					uni.stopPullDownRefresh();
					this.imgList = [...this.imgList, ...res.data.data.records]
				} else {
					uni.stopPullDownRefresh();
				}
			},
			async getMylikeList() {
				this.isloading = true
				this.flag = 2
				const {
					userInfo
				} = this
				let newObj = {
					id: userInfo.id,
					current: this.likePageNum,
					size: 3
				}
				let res = await uni.$API.user.reqGetLikeList(
					newObj
				)
				this.isloading = false
				console.log(res);
				if (res.data.code == 200) {
					uni.stopPullDownRefresh();
					this.imgList = [...this.imgList, ...res.data.data.records]

				} else {
					uni.stopPullDownRefresh();
				}
			},
		},
		onPullDownRefresh() {
			if (this.show == 0) {
				this.imgList = []
				this.focusPageNum = 1
				this.collectPageNum = 1
				this.likePageNum = 1
				console.log(this.show);
				if (this.flag == 0) this.getFocusPicList()
				else if (this.flag == 1) this.getMyCollectList()
				else this.getMylikeList()
			}
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.isloading) return
			if (this.show == 1) {
				let pages = Math.ceil(this.commentsTotal / 6)
				console.log(pages);
				if (this.commentPageNum <= pages) {
					this.commentPageNum++
				}
				console.log('触底了', this.commentPageNum);
				this.getcommentList()
			} else {

				if (this.flag == 0) {
					this.focusPageNum++
					this.getFocusPicList()
				} else if (this.flag == 1) {
					this.collectPageNum++
					this.getMyCollectList()
				} else {
					this.likePageNum++
					this.getMylikeList()
				}
			}


			console.log('触底了');
		}
	}
</script>

<style lang="scss">

</style>
