<template>
	<view class="bind-phone">
		<view class="bind-phone-one" v-if="type===1">
			<view class="bind-phone-text">
				{{bindPhoneLanguage[languageState].text}}
			</view>
			<view class="bind-phone-subtext">
				{{bindPhoneLanguage[languageState].subtext}}
			</view>
			<form @submit="formSubmit" class="form">
				<view class="form-label">
					<view class="label">
						<image src="/static/images/phone.png" mode="widthFix" class="label-img"></image>
						<text class="label-text">{{bindPhoneLanguage[languageState].phone}}</text>
					</view>
					<input type="number" v-model="formData.messagePhone" :placeholder="bindPhoneLanguage[languageState].phonePlaceholder" class="label-input" placeholder-class="label-placeholder" />
				</view>
				<view class="form-label">
					<view class="label">
						<image src="/static/images/code.png" mode="widthFix" class="label-img"></image>
						<text class="label-text">{{bindPhoneLanguage[languageState].code}}</text>
					</view>
					<view class="label-code">
						<input type="number" v-model="formData.messageCode" :placeholder="bindPhoneLanguage[languageState].codePlaceholder" class="label-codeinput"
						 placeholder-class="label-placeholder" />
						<view :class="[time==60?'disablecodeMsg':'','codeMsg']" @click="cutDowm">
							{{bindPhoneLanguage[languageState].msgCode}}
						</view>
					</view>
				</view>
				<button form-type="submit" class="submit">{{bindPhoneLanguage[languageState].submit}}</button>
			</form>
		</view>
		<view class="bind-phone-two" v-if="type===2">
			<image src="/static/images/img-success.png" mode="widthFix" class="img-success"></image>
			<text class="text-success">{{bindPhoneLanguage[languageState].success}}!</text>
		</view>
		<view class="bind-phone-two" v-if="type===3">
			<image src="/static/images/img-fail.png" mode="widthFix" class="img-success"></image>
			<text class="text-success">{{bindPhoneLanguage[languageState].fail}}</text>
			<view class="fail-btn" @click="type=1">
				{{bindPhoneLanguage[languageState].reset}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/utils/login.js'
	import { language } from '@/utils/bindPhoneLanguage.js'
	export default {
		data() {
			return {
				languageState: this.$store.state.language,
				bindPhoneLanguage:language,
				formData: {
					messageCode: '',
					messagePhone: ''
				},
				time: 60,
				type: 1,
				title:'手机绑定'
			}
		},
		onLoad() {
			if(this.languageState === 'en') {
				this.title = 'Phone binding'
			}else{
				this.title = '手机绑定'
			}
			uni.setNavigationBarTitle({
				title:this.title
			})
		},
		methods: {
			cutDowm() {
				let boll = true
				let data = {
					messagePhone: this.formData.messagePhone
				}
				if (data.messagePhone.length !== 0 && this.checkPhone(data.messagePhone)) {
					if (boll) {
						boll = false
						let timer = setInterval(() => {
							this.time--
							if (this.time == 0) {
								this.time = 60;
								boll = true
								if(this.languageState==='en') {
									this.bindPhoneLanguage[this.languageState].msgCode = 'get verification code'
								}else{
									this.bindPhoneLanguage[this.languageState].msgCode = '获取验证码'
								}
								clearInterval(timer)
							} else {
								if(this.languageState==='en') {
									this.bindPhoneLanguage[this.languageState].msgCode =  this.time + 'left'
								}else{
									this.bindPhoneLanguage[this.languageState].msgCode =  '还剩' + this.time + 'S'
								}
							}
						}, 1000)
						this.sendMsg(data).then((res) => {
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: this.bindPhoneLanguage[this.languageState].pnonerule
					})
				}
			},
			formSubmit(e) {
				if (this.formData.messagePhone.length == 0 || !this.checkPhone(this.formData.messagePhone)) {
					uni.showToast({
						icon: 'none',
						title:this.bindPhoneLanguage[this.languageState].pnonerule
					})
					return
				}
				if (this.formData.messageCode.length == 0) {
					uni.showToast({
						icon: 'none',
						title: this.bindPhoneLanguage[this.languageState].coderule
					})
					return
				}
				let boll = true
				if (boll) {
					boll = false
					this.sendMsg(this.formData).then((res) => {
						boll = true
						if (res.data.code === 0) {
							//绑定成功改变状态
							this.type = 2
							//重新登录
							this.loginAgain()
						} else {
							//绑定失败改变状态
							this.type = 3
						}
						this.formData = {
							messageCode: '',
							messagePhone: ''
						};
					})
				}
			},
			sendMsg(data) {
				var that = this;
				return new Promise(function(resolve, reject) {
					wx.request({
						url: that.basaApi + '/mtsUsers/bindUserPhoneWithCode', //仅为示例，并非真实接口地址。
						data: JSON.stringify(data),
						method: 'POST',
						header: {
							'content-type': 'application/json',
							'token-session': that.$store.state.loginInfo.WXAccessToken //自定义请求头信息
						},
						success: (res) => {
							resolve(res)
						},
						fail: (err) => {
							reject(err)
						}
					});
				})
			},
			checkPhone(phone) {
				if (!(/^1[3456789]\d{9}$/.test(phone))) {
					return false;
				} else {
					return true
				}
			},
			//login重新登录获取信息
			loginAgain() {
				var that = this
				wx.getUserInfo({
					success: function(res) {
						login(res).then((res) => {
							that.$store.state.loginInfo = res.data.data;
						})
					},
					fail: function(err) {
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.bind-phone {
		margin: 0px 42upx;

		.bind-phone-text {
			margin-top: 70upx;
			font-size: 40upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(38, 48, 99, 1);
			margin-bottom: 10upx;
		}

		.bind-phone-subtext {
			font-size: 24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(33, 44, 103, 0.44);
			margin-bottom: 64upx;
		}

		.form {
			.form-label {
				margin-bottom: 28upx;

				.label {
					display: flex;
					align-items: center;

					.label-img {
						width: 30upx;
						height: 44upx;
						margin-right: 20upx;
					}

					.label-text {
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(33, 44, 103, 1);
					}
				}

				.label-input {
					height: 80upx;
					position: relative;
					border-bottom: 2upx solid #D9DAEB;
					font-size: 24upx;
					color: #333;
				}

				.label-placeholder {
					position: absolute;
					top: -20upx;
					left: 50upx;
					font-size: 24upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(33, 44, 103, 0.44);
				}

				.label-code {
					display: flex;
					position: relative;

					.label-codeinput {
						height: 80upx;
						width: 430upx;
						flex-shrink: 0;
						position: relative;
						border-bottom: 2upx solid #D9DAEB;
						font-size: 24upx;
						color: #333;

					}

					.codeMsg {
						position: absolute;
						bottom: 4upx;
						right: 0;
						text-align: center;
						width: 200upx;
						height: 50upx;
						line-height: 50upx;
						border-radius: 31upx;
						border: 2upx solid rgba(217, 218, 235, 1);
						font-size: 24upx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: rgba(38, 48, 99, 1);
					}

					.disablecodeMsg {
						background: #65AADD;
						color: #fff;
					}
				}
			}

			.submit {
				width: 342upx;
				margin: 0 auto;
				margin-top: 350upx;
				height: 84upx;
				text-align: center;
				line-height: 84upx;
				background: rgba(248, 182, 6, 1);
				border-radius: 66upx;
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
			}
		}

		.bind-phone-two {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.img-success {
				display: inline-block;
				width: 617upx;
				margin: 0 auto;
				margin-top: 160upx;
				margin-bottom: 220upx;
				height: 503upx;
			}

			.text-success {
				width: 100%;
				display: inline-block;
				text-align: center;
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(33, 44, 103, 1);
			}

			.fail-btn {
				width: 342upx;
				margin: 0 auto;
				height: 84upx;
				margin-top: 40upx;
				text-align: center;
				line-height: 84upx;
				background: rgba(248, 182, 6, 1);
				border-radius: 66upx;
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
</style>
