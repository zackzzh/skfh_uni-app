<template>
	<view class="bottom-Nav">
		<view class="wallet item" :class="{active: active == 0}" @click="clickWallet()">
			<view class="image">
				<image class="img" v-if="active == 0" src="../../static/images/wallet-selected.png" mode=""></image>
				<image class="img" v-else src="../../static/images/wallet.png" mode=""></image>
			</view>
			<view class="con">
				钱包
			</view>
		</view>
		<view class="discernCode item" @click="discernCode()">
			<image class="img" src="../../static/images/scan-default.png" mode=""></image>
		</view>
		<view class="user item" :class="{active: active == 1}" @click="clickUser()">
			<view class="image">
				<image class="img" v-if="active == 1" src="../../static/images/user-selected.png" mode=""></image>
				<image class="img" v-else src="../../static/images/user.png" mode=""></image>
			</view>
			<view class="con">
				账户
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'taber',
		data() {
			return {
				// active: 0
			}
		},
		props: {
			active: {
				type: Number,
				default: 0
			}
		},
		methods: {
			clickWallet() {
				console.log(1,this)
				if (this.$props.active != 0) {
					uni.navigateTo({
					    url: '/pages/wallet/wallet',
					    animationType: 'pop-in',
					    animationDuration: 200
					});
				}
			},
			clickUser() {
				console.log(2,this)
				if (this.$props.active != 1) {
					uni.navigateTo({
					    url: '/pages/self/self',
					    animationType: 'pop-in',
					    animationDuration: 200
					});
				}
			},
			discernCode() {
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			}
		}
	}
</script>

<style style="sass" scoped>
	.bottom-Nav{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 49px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1000;
		background: #fff;
		width: 100%;
		box-shadow: 1px 1px 50px 50px rgba(0,0,0,.1);
		font-size: 10px;
		color: rgba(28, 40, 51, .3);
		text-align: center;
	}
	.item{
		width: 40px;
	}
	.item .img{
		width: 22px;
		height: 22px;
	}
	.item.active{
		color: rgba(101, 170, 221, 1);
	}
	.discernCode .img{
		width: 40px;
		height: 40px;
	}
</style>
