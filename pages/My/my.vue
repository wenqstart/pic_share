<template>
		<div>
			<uni-nav-bar dark :fixed="true" shadow background-color="#39a17c" status-bar
				v-if="!(flag == 2 && show == 1)" :left-icon="isShowBack ? 'left' : ''"
				:right-icon="isShowMore ? 'gear-filled' : ''" :left-text="isShowBack ? '返回' : ''" :title="title"
				@clickLeft="back()" @clickRight="goMore()" />
			<my-register @change="changeFlag" v-if="flag == 0"></my-register>
			<my-login @change="changeFlag" v-if="flag == 1"></my-login>
			<my-userInfo ref="userInfo" v-show="flag == 2" :commentPageNum="commentPageNum"
				:getMySharePicList="getMySharePicList" :getMySaveDynamicList="getMySaveDynamicList" :imgList="imgList"
				:draftList="draftList" :imgNum="imgNum" :draftNum="draftNum" :show="show" :isDynamic="isDynamic"
				@changeDynamic="changeDynamic" @setCommentPageNum="setCommentPageNum" @change="changeFlag"
				@setCurrent="setCommentPageNum" @setShareList="setShareListPageNum" @setDraftList="setDraftListPageNum"
				@changeShow="changeShow">
			</my-userInfo>
			<my-edit @change="changeFlag" v-if="flag == 3"></my-edit>
			<mySetting @change="changeFlag" v-if="flag == 4"></mySetting>
			<view style="display: none;">{{commentPageNum}}</view>
		</div>
</template>

<script>
	import myLogin from './components/my-login.vue'
	import myRegister from './components/my-register.vue'
	import myUserInfo from './components/my-userInfo.vue'
	import myEdit from './components/my-edit.vue'
	import mySetting from './components/my-setting.vue'
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				pwd: '',
				username: '',
				imgList: [],
				draftList: [],
				imgNum: 0,
				draftNum: 0,
				length:1,
				// 0:注册 1：登录 2：个人信息 3：修改信息 4：设置
				flag: 0,
				// 0个人主页 1动态详情
				show: 0,
				// 动态页数
				dynamicPageNum: 1,
				// 草稿页数
				draftPageNum: 1,
				// 评论页数
				commentPageNum: 1,
				isloading: false,
				isDynamic: true
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
			title() {
				if (this.flag === 4) return '设置'
				else return '我的'
			},
			isShowBack() {
				if (this.flag === 3 || this.flag === 4) return true
				else return false
			},
			isShowMore() {
				if (this.flag === 2 || this.flag === 3) return true
				else return false
			}
		},
		components: {
			myLogin,
			myRegister,
			myUserInfo,
			myEdit,
			mySetting
		},
		methods: {
			
			changeDynamic(flag) {
				this.isDynamic = flag
			},
			setCommentPageNum() {
				this.commentPageNum = 1
			},
			setShareListPageNum() {
				this.imgList = []
				this.dynamicPageNum = 1
			},
			setDraftListPageNum() {
				this.draftList = []
				this.draftNum = 1
			},
			changeShow(show) {
				this.show = show
			},
			changeFlag(flag) {
				if (flag == 2) {
					this.imgList = []
					this.getMySharePicList()
				}
				this.flag = flag
			},
			back() {
				this.flag = 2
			},
			goMore() {
				this.flag = 4
			},
			//获取个人分享的图片列表
			async getMySharePicList() {
				this.isloading = true
				let newObj = {
					id: this.userInfo.id,
					current: this.dynamicPageNum,
					size: 8
				}
				let res = await uni.$API.user.reqMySharePicList(newObj)
				this.isloading = false
				console.log(res.data);
				if (res.data.code === 200) {
					uni.stopPullDownRefresh();
					this.imgList = [...this.imgList, ...res.data.data.records]
					this.imgNum = res.data.data.total
				} else {
					uni.stopPullDownRefresh();
					uni.$showMsg(res.data.msg)
				}
			},
			async getMySaveDynamicList() {
				this.isloading = true
				let newObj = {
					id: this.userInfo.id,
					current: this.draftPageNum,
					size: 8
				}
				let res = await uni.$API.user.reqMySavePicList(newObj)
				this.isloading = false
				console.log(res.data);
				if (res.data.code === 200) {
					uni.stopPullDownRefresh();
					this.draftList = [...this.draftList, ...res.data.data.records]
					this.draftNum = res.data.data.total
				} else {
					uni.stopPullDownRefresh();
					uni.$showMsg(res.data.msg)
				}
			},
		},
		onLoad(option) {
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
			console.log(option);
			if (option.toDraft == 1) {
				this.getMySaveDynamicList()
				this.isDynamic = false
			}
			if (this.userInfo.id && this.userInfo.username) {
				this.getMySharePicList()
				this.flag = 2
			} else {
				this.flag = 1
			}
		},
		onPullDownRefresh() {
			this.imgList = []
			this.draftList = []
			console.log(this.flag);
			if (this.flag == 2) {
				this.getMySharePicList()
				this.getMySaveDynamicList()
			}
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.isloading) return
			if (this.flag == 2) {
				if (this.show == 1) {
					let pages = Math.ceil(this.$refs.userInfo.commentsTotal / 6)
					console.log(pages);
					if (this.commentPageNum <= pages) {
						this.commentPageNum++
					}
					console.log('触底了', this.commentPageNum);
					this.$nextTick(() => {
						this.$refs.userInfo.getcommentList()
					})
				} else {
					this.dynamicPageNum++
					this.getMySharePicList()
				}

			}
		}
	}
</script>

<style>
	page {
		/* background-color: #59B091; */
		color: #59B091;
	}
</style>
