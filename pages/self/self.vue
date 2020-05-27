<template>
	<view class="self">
		<view class="self-bg">
			<image src="/static/images/bg.png" mode="widthFix"></image>
			<view class="info-card">
				<open-data type="userAvatarUrl" class="card-left-image"></open-data>
				<open-data type="userNickName" class="navbar-title"></open-data>
				<text class="info-card-text">{{address}}</text>
				<view class="info-scand">
					<tki-qrcode v-if="ifShow" cid="qrcode1" ref="qrcode" :val="val" :size="size" :unit="unit" :icon="icon" :iconSize="iconsize"
					 :onval="onval" :loadMake="loadMake" />
				</view>
			</view>
		</view>
		<view class="self-list">
			<button class="self-item">
				<text>{{language[languageState].avatar}}</text>
				<view class="self-item-right">
					<open-data type="userAvatarUrl" class="item-image"></open-data>
					<image src="/static/images/forward.png" mode="widthFix" class="forward-icon"></image>
				</view>
			</button>
			<view class="self-item">
				<text>{{language[languageState].nickname}}</text>
				<view class="self-item-right">
					<open-data type="userNickName" class="item-title"></open-data>
					<image src="/static/images/forward.png" mode="widthFix" class="forward-icon"></image>
				</view>
			</view>
			<button class="self-item" open-type="getUserInfo" @getuserinfo='getuserinfo'>
				<text>{{language[languageState].phoneBinding}}</text>
				<view class="self-item-right">
					<text class="item-title" v-if="userPhone.length>0">{{userPhone}}</text>
					<image src="/static/images/forward.png" mode="widthFix" class="forward-icon"></image>
				</view>
			</button>
		</view>
	</view>
</template>

<script>
	import taber from '@/components/taber/taber.vue'
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import {
		login
	} from '@/utils/login.js'
	export default {
		components: {
			taber,
			tkiQrcode
		},
		data() {
			return {
				active: 1,
				ifShow: true,
				val: 'https://dsfs.squareent.com?token=' + this.$store.state.address.tokenAddress, // 要生成的二维码值
				size: 245, // 二维码大小
				unit: 'upx', // 单位
				icon: '/static/images/logo.png', // 二维码图标
				iconsize: 40, // 二维码图标大小
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				address: this.$store.state.address.tokenAddress,
				languageState: this.$store.state.language,
				language:{
					'zh':{
						avatar:'头像',
						nickname:'昵称',
						phoneBinding:"手机绑定"
					},
					'en':{
						avatar:'avatar',
						nickname:'nickname',
						phoneBinding:'phoneBinding'
					}
				}
			}
		},
		computed: {
			userPhone() {
				return this.$store.state.loginInfo && this.$store.state.loginInfo.userPhone ? this.$store.state.loginInfo.userPhone : null
			}
		},
		methods: {
			getuserinfo(e) {
				var that = this;
				if (that.$store.state.loginInfo && Object.keys(that.$store.state.loginInfo).length == 0) {
					if (e.detail.errMsg === 'getUserInfo:ok') {
						login(e.detail).then((res) => {
							uni.setStorage({
								key:'loginInfo',
								data:res.data.data
							})
							that.$store.state.loginInfo = res.data.data;
							if (!res.data.data.userPhone) {
								uni.navigateTo({
									url: '../bindPhone/bindPhone'
								})
							}
						})
					} else {
						// console.log('-------拒绝失败')
					}
				} else {
					if (!this.userPhone) {
						uni.navigateTo({
							url: '../bindPhone/bindPhone'
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.self {
		.self-list {
			margin: 0px 33upx;
			margin-top: 20upx;

			.self-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 114upx;
				border-bottom: 4upx solid #D9DAEB;
				background: transparent;
				border-radius: 0;
				padding: 0;

				text {
					font-size: 28upx;
					font-weight: 400;
					color: rgba(33, 44, 103, 1);
				}

				.self-item-right {
					display: flex;
					align-items: center;

					.item-title {
						margin-right: 25upx;
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(33, 44, 103, 1);
					}

					.item-image {
						width: 92upx;
						height: 92upx;
						border-radius: 50%;
						overflow: hidden;
						display: inline-block;
						margin-right: 20upx;
					}

					.forward-icon {
						width: 20px;
						height: 33px;
					}
				}
			}

			button::after {
				border: none;
				border-radius: 0;
			}
		}

		.self-bg {
			height: 810upx;

			image {
				width: 750upx;
			}
		}

		.info-card {
			position: absolute;
			top: 265upx;
			width: 684upx;
			height: 550upx;
			background: rgba(255, 255, 255, 0.89);
			box-shadow: 0px 4px 68px 0px rgba(39, 52, 125, 0.25);
			border-radius: 24upx;
			left: 33upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.card-left-image {
				position: absolute;
				top: -105upx;
				width: 210upx;
				height: 210upx;
				border-radius: 50%;
				overflow: hidden;
				display: inline-block;
			}

			.navbar-title {
				padding-top: 135upx;
				font-size: 32upx;
				font-weight: 400;
				color: rgba(33, 44, 103, 1);
				margin-bottom: 20upx;
			}

			.info-card-text {
				font-size: 24upx;
				margin-bottom: 40upx;
			}

			.info-scand {
				width: 245upx;
				height: 245upx;
				// background: #000;
			}
		}
	}
</style>
