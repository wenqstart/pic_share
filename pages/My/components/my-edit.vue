<template>
	<view>
		<TkScreenScroll :lengths="length" @getScreenIndes="getScreenIndes" @toLeft="toLeft" @toRight="toRight">
		<uni-section title="基本信息" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :modelValue="user">
					<uni-forms-item label="头像" required>
						<uni-file-picker class="upload" v-model="imageValue" fileMediatype="image"
							file-extname="png,jpg" limit="1" mode="grid" :auto-upload="false" :del-icon="true"
							@select="select" @progress="progress" @success="success" :image-styles="imageStyles"
							@fail="fail">
							<uni-icons type="plusempty" size="30" color="#efeff4"></uni-icons>
						</uni-file-picker>
					</uni-forms-item>

					<uni-forms-item label="用户名" required>
						<uni-easyinput v-model="user.username" placeholder="请输入用户名" />
					</uni-forms-item>
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="user.sex" :localdata="sexs" @change="changeSex" />
					</uni-forms-item>
					<uni-forms-item label="简介">
						<uni-easyinput type="textarea" v-model="user.introduce" placeholder="请输入自我介绍" />
					</uni-forms-item>
				</uni-forms>
				<view class="button">
					<button type="primary" size="mini" class="submit" @click="submit">提交</button>
				</view>
				
			</view>
		</uni-section>
		</TkScreenScroll>
	</view>
</template>

<script>
	import TkScreenScroll from '@/components/changeScreenScroll.vue'
	import {
		mapState
	} from 'vuex'
	import store from '@/store/index.js'
	export default {
		name: "my-edit",
		components:{
			TkScreenScroll
		},
		data() {
			return {
				length:1,
				user: {
					username: '',
					sex: 2,
					introduce: '',
					avatar: ''
				},
				sexs: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '保密',
					value: 2
				}],
				imageValue: {
					url: ''
				},
				imgPath: [],
				imageStyles: {
					width: 80,
					height: 80,
					background: {
						// color: '#eee',
					},
					border: {
						// color: "#fff",
						// width: 2,
						// style: 'dashed',
						radius: '50%'
					}
				}
			};
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
			changeSex() {
				console.log(this.user);
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
				this.imgPath = this.imgPath.concat(e.tempFilePaths)
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
			// 重新获取用户数据存入store
			setUserInfo(){
				console.log(this.userInfo.password);
				uni.$API.user.reqLogin({
					username:this.user.username,
					password:this.userInfo.password
				}).then(res=>{
					console.log(res.data);
					if (res.data.code == 200) {
						let userInfo = res.data.data
						userInfo.password = this.userInfo.password
						store.dispatch('user/setUserInfo', userInfo)
						console.log(this.userInfo);
					} else {
						uni.$showMsg(res.data.msg)
					}
				})
			},
			// 提交修改信息
			submit() {
				console.log('修改信息');
				const {
					user,
					imgPath,
					userInfo
				} = this
				const _this = this
				if (imgPath.length !== 0) {
					uni.uploadFile({
						url: 'http://47.107.52.7:88/member/photo/image/upload',
						// files: tempImg, // 文件
						filePath: imgPath[0],
						// fileType: "image",
						name: 'fileList', // 在FormData 中文件对应的属性名
						// formData: data, // 除文件外其他所有数据，传对象，会默认转换为 FormData
						header: {
							"Accept": "application/json, text/plain, */*",
							"appId": "786835bd0dda4983877f0f9f1e740246",
							"appSecret": "87085a2cdbe9c9ea346b28f51bd45618e64b7"
						},
						success: async (res) => {
							let resObj = JSON.parse(res.data)
							console.log(resObj);
							user.avatar = resObj.data.imageUrlList[0]
							const {
								avatar,
								introduce,
								sex,
								username
							} = user
							console.log(avatar,
								introduce,
								sex,
								username);
							let result = await uni.$API.user.reqUpdate({
								avatar,
								introduce,
								sex,
								username,
								id: userInfo.id
							})
							console.log(result);
							if (result.data.code == 200) {
								_this.user.username = username
								_this.setUserInfo()
								uni.$showMsg('修改成功！')
							}
						},
						error: function(res) {
							console.error(res, 'res---error')
						}
					})
				} else {
					const {
						introduce,
						sex,
						username
					} = user
					console.log(introduce, sex, username);
					uni.$API.user.reqUpdate({
						introduce,
						sex,
						username,
						id: userInfo.id
					}).then(res => {
						console.log(res);
						if (res.data.code == 200) {
							_this.user.username = username
							_this.setUserInfo()
							uni.$showMsg('修改成功！')
						}
					})
				}
			},
			initUserInfo() {
				const {
					avatar,
					introduce,
					sex,
					username
				} = this.userInfo
				this.imageValue.url = avatar
				this.user = {
					avatar,
					introduce,
					sex,
					username
				}
			}
		},
		computed: {
			...mapState('user', ['userInfo'])
		},
		mounted() {	
			this.initUserInfo()
		}
		
	}
</script>

<style lang="scss" scoped>
	.example{
		padding: 20rpx;
		.button{
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
			margin-bottom: 50rpx;
		}
		}
		
	}
	
</style>
