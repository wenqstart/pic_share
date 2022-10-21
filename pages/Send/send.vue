<template>
	<TkScreenScroll :lengths="length" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
	<div>
		<div class="send" v-if="show == 0">
			<uni-nav-bar dark :fixed="true" shadow background-color="#39a17c" status-bar title="发布" />
			<uni-section title="选择上传图片" type="line">
				<view class="example-body">
					<!-- <uni-file-picker @select="select" v-model="imgValue" limit="5" file-mediatype="all" title="最多选择5个文件">
				</uni-file-picker> -->
					<uni-file-picker class="upload" v-model="imgValue" fileMediatype="image" file-extname="png,jpg"
						limit="5" mode="grid" :auto-upload="false" :del-icon="true" @select="select"
						@progress="progress" @success="success" @fail="fail">
						<uni-icons type="plusempty" size="30" color="#efeff4"></uni-icons>
					</uni-file-picker>

				</view>
			</uni-section>
			<view class="example">
				<uni-forms label-position="top">
					<uni-forms-item label="标题" name="name">
						<uni-easyinput type="text" v-model="title" placeholder="请输入标题" />
					</uni-forms-item>
					<uni-forms-item label="文章内容">
						<uni-easyinput type="textarea" v-model="content" placeholder="编辑你的文本吧~" />
					</uni-forms-item>
				</uni-forms>
			</view>

			<view class="goods-carts">
				<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="iconClick"
					@buttonClick="buttonClick" />
			</view>
		</div>
		<login title="发布" v-else />
	</div>
	</TkScreenScroll>
</template>


<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import {
		mapState
	} from 'vuex'
	import login from '@/components/login.vue'
	export default {
		computed: {
			...mapState('user', ['userInfo'])
		},
		components: {
			login,
			TkScreenScroll
		},
		mounted() {
			if (this.userInfo.id && this.userInfo.username) {
				this.show = 0
			} else {
				this.show = 1
			}
		},
		watch: {
			userInfo(newValue, oldValue) {
				if (this.userInfo.id && this.userInfo.username) {
					this.show = 0
				} else {
					this.show = 1
				}
			}
		},
		data() {
			return {
				show: 0,
				title: '',
				length:1,
				content: '',
				imgValue: [],
				imgPath: [],
				imageCode: '',
				options: [{
						icon: 'shop',
						text: '草稿'
					},
					{
						icon: 'download',
						text: '保存'
					}
				],

				buttonGroup: [{
					text: '发布',
					backgroundColor: 'linear-gradient(90deg, #69d0aa, #59B091)',
					color: '#fff'
				}],
			}
		},
		methods: {
			toLeft(indexs){
				console.log(indexs);
				uni.switchTab({
					url:'/pages/Find/find'
				})
			},
			toRight(indexs){
				console.log(indexs);
				uni.switchTab({
					url:'/pages/My/my'
				})
				
			},
			getScreenIndes(indexs) {
				console.log(indexs);
			},
			iconClick(e) {
				console.log(e);
				if(e.content.text=='草稿'){
					// 查看草稿
					uni.reLaunch({
						url:'/pages/My/my?toDraft=1'
					})
				}else{
					// 保存动态
					this.saveImg()
				}
			},
			buttonClick(e) {
				console.log(e);
				this.sendImg()
			},
			saveImg(){
				const {
					imgValue,
					imgPath,
					title,
					content
				} = this
				const _this = this
				const tempImg = this.imgValue.map(item => {
					return {
						name: 'fileList',
						uri: item.url
					}
				})
				
				uni.uploadFile({
					url: 'http://47.107.52.7:88/member/photo/image/upload',
					files: tempImg, // 文件
					// filePath:imgPath[0],
					// fileType: "image",
					// name:'fileList', // 在FormData 中文件对应的属性名
					// formData: data, // 除文件外其他所有数据，传对象，会默认转换为 FormData
					header: {
						"Accept": "application/json, text/plain, */*",
						'appId': '9de9402af49541a29d911e471ba6d7e4        ',
						'appSecret': '13926f7fe3c007edc436e95cd6f8a6dff9842'
					},
				
					success: async (res) => {
						let resObj = JSON.parse(res.data)
						console.log(resObj);
						_this.imageCode = resObj.data.imageCode
						let result = await uni.$API.user.reqSavePicShare({
							content,
							imageCode: _this.imageCode,
							pUserId: _this.userInfo.id,
							title
						})
						console.log(result);
						if (result.data.code == 200) {
							uni.$showMsg('保存成功！')
							this.imgValue = []
							this.title = ''
							this.content = ''
						}
					},
					error: function(res) {
						console.error(res, 'res---error')
					}
				})
			},
			sendImg() {
				const {
					imgValue,
					imgPath,
					title,
					content
				} = this
				const _this = this
				const tempImg = this.imgValue.map(item => {
					return {
						name: 'fileList',
						uri: item.url
					}
				})

				uni.uploadFile({
					url: 'http://47.107.52.7:88/member/photo/image/upload',
					files: tempImg, // 文件
					// filePath:imgPath[0],
					// fileType: "image",
					// name:'fileList', // 在FormData 中文件对应的属性名
					// formData: data, // 除文件外其他所有数据，传对象，会默认转换为 FormData
					header: {
						"Accept": "application/json, text/plain, */*",
						'appId': '9de9402af49541a29d911e471ba6d7e4        ',
						'appSecret': '13926f7fe3c007edc436e95cd6f8a6dff9842'
					},

					success: async (res) => {
						let resObj = JSON.parse(res.data)
						console.log(resObj);
						_this.imageCode = resObj.data.imageCode
						let result = await uni.$API.user.reqAddPicShare({
							content,
							imageCode: _this.imageCode,
							pUserId: _this.userInfo.id,
							title
						})
						console.log(result);
						if (result.data.code == 200) {
							uni.$showMsg('上传成功！')
							this.imgValue = []
							this.title = ''
							this.content = ''
						}
					},
					error: function(res) {
						console.error(res, 'res---error')
					}
				})
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
				const {
					tempFiles,
					tempFilePaths
				} = e
				this.imgPath = this.imgPath.concat(tempFilePaths)
				this.imgValue = this.imgValue.concat(tempFiles)
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
		}
	}
</script>

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
	}

	.example-body {
		padding: 20rpx;
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}

	.uni-mt-5 {
		margin-top: 5px;
	}
</style>
