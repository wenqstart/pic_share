<template>
	<!-- 屏幕左右滑动切换tabs功能组件 -->
	<view class="tk-screen-scroll" @touchstart.stop="handleTouchstart" @touchend.stop="handleTouchend">
		<slot></slot>
	</view>
</template>


<script>
	export default {
		name: 'TkScreenScroll',
		props: {
			lengths: { // tabs 项数 也叫长度
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				startX: 0,
				startY: 0,
				indexs: 0
			}
		},
		mounted() {
			console.log(this.lengths);

		},
		methods: {
			// 获取鼠标、手指初始位置
			handleTouchstart(e) {
				this.startTime = Date.now();
				this.startX = e.changedTouches[0].clientX;
				this.startY = e.changedTouches[0].clientY;
			},
			// 计算鼠标、手指偏移方向
			handleTouchend(e) {
				const endTime = Date.now();
				const length = this.lengths - 1;
				const endX = e.changedTouches[0].clientX;
				const endY = e.changedTouches[0].clientY;
				const differ = Math.abs(endY - this.startY);
				const dirvalX = endX - this.startX;
				// 纵轴偏移量不得超过 30，否则默认页面进行滚动操作
				if (differ <= 30) {
					// 按下时长不得超过 2秒，X轴滑动距离必须大于 40
					if (endTime - this.startTime > 2000 || Math.abs(dirvalX) <= 40) {
						return
					};
					// 判断滑动方向
					if (dirvalX > 0) {
						this.indexs--;
						if (this.indexs < 0) {
							this.indexs = 0;
							this.$emit('toLeft', this.indexs);
							return
						}
					} else if (dirvalX < 0) {
						this.indexs++;
						if (this.indexs > length) {
							this.indexs = length;
							this.$emit('toRight', this.indexs);
							return 
						}
					}
					// 返回索引值
					this.$emit('getScreenIndes', this.indexs);
				}
			}
		}
	}
</script>

</script>

<style>

</style>
