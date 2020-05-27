<template>
	<view class="wallet">
		<view class="wallet-bg">
			<image src="../../static/images/bg.png" mode=""></image>
		</view>
		<view class="top-About">
			<view class="user-Name">
				<!-- {{userName}} -->
				<open-data type="userNickName" class="navbar-title"></open-data>
			</view>
			<view class="title">
				{{t[languageState].HealthProtection}}
			</view>
		</view>
		<view class="wawllet-Card">
			<view class="top-Title">
				<view class="logo">
					<image src="../../static/images/logo.png" mode=""></image>
				</view>
				<view class="language" @click="chagneLanguage">
					<image v-if="languageState == 'zh'" src="../../static/images/Chinese.png" class="img" mode=""></image>
					<image v-else src="../../static/images/English.png" class="img" mode=""></image>
				</view>
			</view>
			
			<view class="surplus">
				<view class="surplus-btn">
					{{t[languageState].exponent}}
				</view>
				<view class="num">
					{{addressBalance.balanceToken || '0.00'}}
				</view>
			</view>
			<view class="user-id">
				<text class="label">{{t[languageState].account}}:</text>
				<button class="login" type="default" v-if="!addressBalance.tokenAddress" open-type="getUserInfo"  @getuserinfo="changlogin">{{languageState == 'zh' ? "请先登录" : "Please login first"}}</button>
				<text v-else>{{addressBalance.tokenAddress}}</text>
			</view>
		</view>
		<view class="earnings">
			<view class="title">
				{{t[languageState].exponentRecord}}
			</view>
			<view class="earnings-List" v-if="recordData.length">
				<view class="earnings-Item" v-for="(item, index) in recordData" :key="index">
					<view class="earnings-Detail">
						{{item[languageState == 'zh' ? 'productName' : 'productNameEn']}}
					</view>
					<view class="earnings-Num">
						{{item.payType == "收入" ? "+" : "-"}} {{item.mthToken}}
					</view>
				</view>
			</view>
			<view class="noData" v-else>
				{{t[languageState].noData}}
			</view>
		</view>
		<!-- <taber :active="active"></taber> -->
	</view>
</template>

<script>
	import taber from '@/components/taber/taber.vue'
	import languages from '../../utils/walletLanguage.js'
	import {login} from '../../utils/login.js'
	export default {
		components: {
			taber
		},
		data() {
			return {
				
				language: {
					zh: "chinese",
					en: "english"
				},
				languageState: this.$store.state.language,
				active: 0,
				loginInfo: this.$store.state.loginInfo,
				userName: this.$store.state.loginInfo.userName || 'User Name',
				recordData: [],
				addressBalance: {},
				t: languages
			}
		},
		mounted() {
			this.getUserInfo()
			this.getUserBalance()
		},
		methods: {
			changlogin() {
				const that = this
				console.log(1)
				uni.getUserInfo({
					success: function(res) {
						console.log(res)
						uni.showLoading()
						login(res).then((res) => {
							uni.hideLoading()
							// uni.setStorage({
							// 	key:'loginInfo',
							// 	data:res.data.data
							// })
							that.$store.commit('changeStatelogin',res.data.data)
						})
					},
					fail: function(err) {
						uni.hideLoading()
						// console.log('err', err)
					}
				})
			}
			,
			getUserInfo() {
				if(this.$store.state.loginInfo && !this.$store.state.loginInfo.WXAccessToken) { 
					return
				}
				uni.request({
					url: this.basaApi + '/mtsUsers/getUserTokenHistory',
					method: 'POST',
					header: {
						"token-session": this.$store.state.loginInfo.WXAccessToken || null
					},
					success: (res) => {
						// console.log('res', res);
						if (res.data.code == 0) {
							this.recordData = res.data.data
						}
					}
				})
			},
			getUserBalance() {
				if(this.$store.state.loginInfo && !this.$store.state.loginInfo.WXAccessToken) {
					return
				}
				uni.request({
					url: this.basaApi + '/mtsUsers/getUserBalance',
					method: 'POST',
					header: {
						"token-session": this.$store.state.loginInfo.WXAccessToken || null
					},
					success: (res) => {
						if (res.data.code == 0) {
							this.addressBalance = res.data.data
							this.$store.commit('changeStateAddress', res.data.data)
						}
						else {
							wx.getUserInfo({
								success: (res) => {
									login(res).then((res) => {
										// uni.setStorage({
										// 	key:'loginInfo',
										// 	data:res.data.data
										// })
										this.$store.commit('changeStatelogin',res.data.data)
									})
								},
								fail: function(err) {
									// console.log('err', err)
								}
							})
						}
					}
				})
			},
			chagneLanguage() {
				// console.log(this.languageState)
				this.languageState = this.languageState == 'zh' ? 'en' : 'zh'
				this.$store.commit("changeStateLanguage", this.languageState)
			}
		},
		watch: {
			"$store.state.loginInfo": function(newValue) {
				this.getUserInfo()
				this.getUserBalance()
				this.loginInfo = newValue
				this.userName = newValue.userName
			},
			"$store.state.language": function(newV){
				this.languageState = newV
			}
		}
	}
</script>

<style scoped lang="scss">
	.login{
		border: 0px solid rgba($color: #ffffff, $alpha: 1.0);
		background-color: #4CD964;
		color: #FFFFFF;
		font-size: 12px;
		box-shadow: 0;
		margin: 0;
		line-height: 20px;
	}
	.wallet {
		padding: 20px 15px 100px;
	}
	.top-Title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.language{
			width: 50upx;
			height: 46upx;
			.img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.wallet-bg {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}

	.wallet-bg image {
		width: 100%;
		height: 300px;
	}

	.user-Name {
		padding-top: 20px;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 21px;
		margin: 15px 0;
	}
	.top-About{
		margin: 15px 0;
	}
	.top-About .title {
		font-size: 30px;
		font-family: Helvetica;
		color: rgba(255, 255, 255, 1);
		line-height: 62px;
	}

	.wawllet-Card {
		width: 100%;
		padding: 35px;
		background: rgba(255, 255, 255, 0.89);
		box-shadow: 0px 4px 68px 0px rgba(39, 52, 125, 0.25);
		border-radius: 12px;
		box-sizing: border-box;
	}

	.wawllet-Card .logo image {
		width: 40px;
		height: 40px;
	}

	.wawllet-Card .surplus {
		margin-top: 20px;
		display: flex;
		align-items: center;
	}

	.wawllet-Card .surplus-btn {
		height: 26px;
		background: rgba(248, 182, 6, 1);
		border-radius: 8px;
		font-size: 12px;
		padding: 0 5px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(38, 48, 99, 1);
		line-height: 26px;
		text-align: center;
		margin-right: 10px;
	}

	.wawllet-Card .num {
		font-size: 36px;
		font-family: Helvetica;
		color: rgba(38, 48, 99, 1);
		line-height: 43px;
	}

	.wawllet-Card .user-id {
		margin-top: 20px;
		width: 100%;
		font-size: 12px;
		font-family: Helvetica;
		color: rgba(38, 48, 99, 1);
		line-height: 15px;
		word-break: break-word;
		display: flex;
	}

	.wawllet-Card .user-id .label {
		padding-right: 15upx;
		white-space:nowrap;
	}

	.earnings {
		margin-top: 35px;
	}

	.earnings .title {
		height: 40px;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(33, 44, 103, 1);
		line-height: 40px;
		border-bottom: 1px solid rgba(225, 227, 236, 1);
	}

	.earnings .earnings-Item {
		height: 55px;
		background: rgba(255, 255, 255, 0.89);
		box-shadow: 0px 4px 28px 0px rgba(39, 52, 125, 0.05);
		border-radius: 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		margin-top: 20px;
		box-sizing: border-box;
		padding: 15px;
	}

	.earnings .earnings-Num {
		font-size: 13px;
		font-family: Helvetica;
		color: rgba(65, 65, 65, 1);
	}

	.noData {
		line-height: 80px;
		font-size: 20px;
		color: rgba(0, 0, 0, .5);
		text-align: center;
	}
</style>
