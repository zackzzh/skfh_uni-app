<template>
	<view class="detail">
		<view class="product-photo">
			<view class="product-Box">
				<image class="img" :src="detailData.productInfo.baseInfo.img" mode=""></image>
			</view>
			<view class="languageChange" @click="languageChange">
				<image class="img" v-if="languageChangeState == 'zh'" src="../../static/images/butt-chinese.png" mode=""></image>
				<image class="img" v-if="languageChangeState == 'en'" src="../../static/images/butt-english.png" mode=""></image>
			</view>
		</view>
		<view class="detail-Card">
			<view class="title">
				{{t[languageChangeState].product}}
			</view>
			<view class="con">
				<view class="item">
					<view class="label">
						{{t[languageChangeState].uid}}
					</view>
					<view class="context">
						{{uid}}
					</view>
					
				</view>
				<view class="item" :key="name" v-for="(value, name) in detailData.productInfo[languageChangeState == 'zh' ? 'dCn' : 'dEn']">
					<view class="label">
						{{name}}
					</view>
					<view class="context" v-if="value.ishtml">
						{{value.content}}
					</view>
					<view class="context" v-else>
						<rich-text :nodes="value.content"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<view class="detail-Card">
			<view class="title">
				{{t[languageChangeState].TheManufacturerInformation}}
			</view>
			<view class="con">
				<view class="item" v-if="detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].address">
					<view class="label">
						{{t[languageChangeState].address}}
					</view>
					<view class="context">
						{{detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].address}}
					</view>
				</view>
				<view class="item" v-if="detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].name">
					<view class="label">
						{{t[languageChangeState].name}}
					</view>
					<view class="context">
						{{detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].name}}
					</view>
				</view>
				<view class="item" v-if="detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].phone">
					<view class="label">
						{{t[languageChangeState].phone}}
					</view>
					<view class="context">
						{{detailData.productInfo[languageChangeState == 'zh' ? 'mCn' : 'mEn'].phone}}
					</view>
				</view>
				
			</view>
		</view>
		<view class="detail-Card">
			<view class="title">
				{{t[languageChangeState].Traceability}}
			</view>
			<view class="con">
				
				<view class="trace-Item" :class="{active: index>0}" :key="index" v-for="(item,index) in detailData.productTracing">
					<view class="trace-Label">
						{{item[languageChangeState == 'zh' ? 'contentData' : 'contentDataEn']}}
					</view>
					<view class="trace-Time">
						{{item.tracingTime}}
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {login} from '../../utils/login.js'
	import language from '../../utils/detailLanguage.js'
	export default {
		data() {
			return {
				uid: '',
				detailData: [],
				moreActive: true,
				languageChangeState: 'zh',
				t: language
			}
		},
		onLoad(option) {
			// console.log(option)
			this.uid =  option.uid
			this.languageChangeState = uni.getStorageSync('language') || 'zh'
			let token = uni.getStorageSync('loginInfo').WXAccessToken
			console.log(token)
			const that = this
			uni.showLoading()
			uni.request({
				url: this.basaApi + "/mtsUsers/getProductTracingInfo?productScanCode=" +  option.uid,
				// url: this.basaApi + "/mtsUsers/getProductTracingInfo?productScanCode=" +  '020010000001',
				method: "POST",
				header:{
					"token-session": token
				},
				success(res) {
					uni.hideLoading()
					if(res.data.code == 0) {
						// console.log(res)
						that.detailData = res.data.data
					} else if(res.data.code == '30007') {
						uni.showToast({
						    title: res.data.msg,
						    duration: 2000,
							icon: 'none'
						});
						uni.navigateTo({
							url: "/pages/index/index"
						})
					}
					else {
						uni.showToast({
						    title: '请先登录',
						    duration: 2000,
							icon: 'none'
						});
						uni.navigateTo({
							url: "/pages/index/index"
						})
					}
					
				},
				fail(){
					uni.hideLoading()
					uni.showToast({
					    title: '解析失败',
					    duration: 2000,
						icon: 'none'
					})
					// uni.navigateTo({
					// 	url: "/pages/index/index"
					// })
				}
			})
		},
		methods: {
			seeMore() {
				// console.log(this.moreActive)
				this.moreActive = false
			},
			languageChange() {
				console.log(this.languageChangeState)
				this.languageChangeState = this.languageChangeState == 'zh' ? 'en' : 'zh'
				this.$store.commit("changeStateLanguage", this.languageChangeState)
				this.languageChangeState == 'zh' ? uni.setNavigationBarTitle({title: this.t.zh.product}) : uni.setNavigationBarTitle({title: this.t.en.product})
			}
		}
	
		
	}
	
</script>

<style scoped lang="scss">
	.detail{
		background-color:#F7F7FC;
		min-height: 100vh;
		padding-bottom: 15px;
	}
	.product-photo{
		width: 100%;
		height: 750upx;
		background-image: url(../../static/images/bg-img.png);
		background-size: 100%;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		position: relative;
		.languageChange{
			position: absolute;
			bottom: 40upx;
			right: 100upx;
			width: 70upx;
			height: 70upx;
			.img{
				width: 100%;
				height: 100%;
			}
		}
		// align-items: center;
		.product-Box{
			margin-top: 150upx;
			width: 560upx;
			height: 560upx;
			box-sizing: border-box;
			border: 28px solid rgba(218,229,237,.5);
			border-radius: 50%;
			overflow: hidden;
			.img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.detail-Card{
		width:684upx;
		margin: 20px auto;
		background:rgba(255,255,255,0.89);
		box-shadow:0px 1upx 20upx 0px rgba(39,52,125,0.1);
		border-radius:20upx;
		.title{
			height: 90upx;
			background-image: url(../../static/images/titlebar-bg.png);
			background-size: 100% 100%;
			font-size:40upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			line-height:90upx;
			padding-left: 28upx;
		}
		.con{
			padding: 28upx;
			.label{
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(38,48,99,1);
				line-height:33upx;
				letter-spacing:1px;
			}
			.context{
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:33upx;
				letter-spacing:1px;
			}
			.item,.trace-Item{
				margin-bottom: 20upx;
			}
			.trace-Item{
				padding-left: 18px;
				position: relative;
			}
			.trace-Item:after{
				content: " ";
				width:10upx;
				height:10upx;
				background:rgba(248,182,6,1);
				position: absolute;
				left: 0;
				top: 50%;
				margin-top: -5upx;
				border-radius: 50%;
			}
			.active::before{
				content: " ";
				width:2upx;
				height:100%;
				background:rgba(248,182,6,1);
				position: absolute;
				left: 4upx;
				top: -50%;
				margin-top: -10upx;
				border-radius: 50%;
			}
			.trace-Label{
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:33upx;
				letter-spacing:1px;
			}
			.trace-Time{
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:40upx;
			}
		}
	}
</style>
