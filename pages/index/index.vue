<template>
	<view>
		<wallet v-if="active == 0"></wallet>
		<user v-if="active == 1"></user>
		<view class="bottom-Nav">
			<view class="wallet item" :class="{active: active == 0}" @click="clickWallet()">
				<view class="image">
					<image class="img" v-if="active == 0" src="../../static/images/wallet-selected2x.png" mode=""></image>
					<image class="img" v-else src="../../static/images/wallet2x.png" mode=""></image>
				</view>
				<view class="con">
					{{t[languageState].wallet}}
				</view>
			</view>
			<view class="discernCode item" @click="discernCode()">
				<image class="img" src="../../static/images/scan.png" mode=""></image>
			</view>
			<view class="user item userBtn" :class="{active: active == 1}">
				<button type="default" class="userBtn" open-type="getUserInfo" @getuserinfo='getuserinfo'>
					<view class="image">
						<image class="img" v-if="active == 1" src="../../static/images/user-selected.png" mode=""></image>
						<image class="img" v-else src="../../static/images/user.png" mode=""></image>
					</view>
					<view class="con">
						{{t[languageState].user}}
					</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import language from '../..//utils/walletLanguage.js'
	import wallet from '../wallet/wallet'
	import user from '../self/self'
	import {
		login
	} from '@/utils/login.js'
	export default {
		name: 'taber',
		components: {
			wallet,
			user
		},
		data() {
			return {
				active: 0,
				res: 0,
				languageState: this.$store.state.language || 'zh',
				t: language
			}
		},
		onLoad(option) {
			this.res = JSON.stringify(option)
			// console.log(option)
			if (option.q) {
				if(!uni.getStorageSync('loginInfo').WXAccessToken)  {
					uni.showToast({
						title: this.languageState == 'zh' ? '请先登录授权' : 'Place login first',
						icon: 'none'
					})
				} else {
					let code = decodeURIComponent(option.q)
					if (code.indexOf('?uid=') > 0) {
						let data = code.split('?uid=')
						uni.navigateTo({
							url: '/pages/detail/detail?uid=' + data[1]
						})
					} else {
						uni.showToast({
							title: '二维码解析失败',
							duration: 2000,
							icon: 'none'
						});
					}
				}
				
			}
			uni.getUserInfo({
				success(res) {
					// console.log(res)
				}
			})
		},
		// props: {
		// 	active: {
		// 		type: Number,
		// 		default: 0
		// 	}
		// },
		methods: {
			clickWallet() {
				this.active = 0
			},
			getuserinfo(e) {
				this.active = 1
				var that = this;
				if (that.$store.state.loginInfo && Object.keys(that.$store.state.loginInfo).length == 0) {
					if (e.detail.errMsg === 'getUserInfo:ok') {
						login(e.detail).then((res) => {
							uni.setStorage({
								key:'loginInfo',
								data:res.data.data
							})
							that.$store.state.loginInfo = res.data.data;
						})
					} else {
						// console.log('-------拒绝失败')
					}
				}
			},
			discernCode() {
				console.log(uni.getStorageSync('loginInfo'))
				if(!uni.getStorageSync('loginInfo').WXAccessToken)  {
					uni.showToast({
						title: this.languageState == 'zh' ? '请先登录授权' : 'Place login first',
						icon: 'none'
					})
				} else {
					uni.scanCode({
							success: function(res) {
								uni.showToast({
									title: this.languageState == 'zh' ? '扫码成功' : 'success',
									duration: 2000,
									icon: 'none'
								});
								let code = res.result
								if (code.indexOf('?uid=') > 0) {
									let data = code.split('?uid=')
									uni.navigateTo({
										url: '/pages/detail/detail?uid=' + data[1]
									})
								} else {
									uni.showToast({
										title: this.languageState == 'zh' ? '二维码解析失败' : 'error',
										duration: 2000,
										icon: 'none'
									});
								}
							},
							fail() {
								uni.showToast({
									title: this.languageState == 'zh' ? '二维码解析失败' : 'error',
									duration: 2000,
									icon: 'none'
								});
							}
						});
					}
				}
				
		},
		watch: {
			"$store.state.language": function(newV){
				this.languageState = newV
			}
		} 
	}
</script>

<style style="sass" scoped>
	.code {
		word-wrap: break-word;
	}

	.userBtn {
		background: #fff;
		line-height: 12px;
		font-size: 10px;
		color: rgba(28, 40, 51, .3);
		border: none;
	}
  .active.userBtn .con{
    color: rgba(101, 170, 221, 1);
  }
	button::after {
		border: none;
	}

	.bottom-Nav {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 130upx;
		position: fixed;
		bottom: 0;
		background: #fff;
		left: 0;
		width: 100%;
		box-shadow: 1px 1px 50px 50px rgba(0,0,0,.1);
		font-size: 24upx;
		box-shadow: 1px 1px 50px 50px rgba(0, 0, 0, .1);
		font-size: 10px;
		color: rgba(28, 40, 51, .3);
		text-align: center;
	}

	.item {
		width: 200upx;
	}
	.item .img{
		width: 60upx;
		height: 60upx;
	}
	.item .img {
		width: 50upx;
		height: 50upx;
	}

	.item.active {
		color: rgba(101, 170, 221, 1);
	}
	.discernCode{
		width: 120upx;
	}
	.discernCode .img{
		width: 100upx;
		height: 100upx;
	}
	.discernCode {
		width: 90upx;
	}

	.discernCode .img {
		width: 90upx;
		height: 90upx;
	}
</style>
