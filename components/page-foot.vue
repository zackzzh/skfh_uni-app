<template>

	<view class="page-foot">
		<!-- 	<view class="page-foot-item" v-for="(item,index) in navBar" @click="bindCurrent(index)">
			<image v-if="item.scandPath" :src=item.scandPath mode="widthFix" class="scand-image"></image>
			<image v-else :src="index==current?item.selectedIconPath:item.iconPath" mode="widthFix"></image>
			<text v-if="item.label" :class="{'active':current===index}">{{item.label}}</text>
		</view> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				current: 0,
				navBar: [{
						iconPath: '/static/wallet.png',
						selectedIconPath: '/static/wallet-selected.png',
						label: '钱包'
					},
					{
						scandPath: '/static/scan-default.png',
					},
					{
						iconPath: '/static/user.png',
						selectedIconPath: '/static/user-selected.png',
						label: '账户'
					}
				]
			}
		},
		methods: {
			bindCurrent(index) {
				this.current = index
				if (index == 1) {
					uni.scanCode({
						scanType: 'qrCode',
						success: function(res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	// .page-foot {
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: space-around;
	// 	position: fixed;
	// 	bottom: 0;
	// 	width: 100%;
	// 	background: #FFFFFF;
	// 	height: 98upx;
	// 	left: 0;

	// 	.page-foot-item {
	// 		display: flex;
	// 		flex-direction: column;
	// 		align-items: center;
	// 		justify-content: center;

	// 		image {
	// 			width: 34upx;
	// 			height: 34upx;
	// 			margin: 6upx 0;
	// 		}

	// 		text {
	// 			font-size: 12px;
	// 			color: rgba(28, 40, 51, 1);
	// 		}

	// 		.active {
	// 			color: #65AADD;
	// 		}

	// 		.scand-image {
	// 			width: 80upx;
	// 			height: 80upx;
	// 			border-radius: 50%;
	// 		}
	// 	}
	// }
</style>
