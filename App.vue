<script>
	import {
		login
	} from '@/utils/login.js'
	export default {
		onLaunch: function() {
			const updateManager = uni.getUpdateManager();
			
			updateManager.onCheckForUpdate(function (res) {
			  // 请求完新版本信息的回调
			  console.log(res.hasUpdate);
			});
			
			updateManager.onUpdateReady(function (res) {
			  uni.showModal({
			    title: '更新提示',
			    content: '新版本已经准备好，是否重启应用？',
			    success(res) {
			      if (res.confirm) {
			        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			        updateManager.applyUpdate();
			      }
			    }
			  });
			
			});
			
			updateManager.onUpdateFailed(function (res) {
			  // 新的版本下载失败
			  uni.showModal({
			    title: '更新提示',
			    content: '新版本更新失败，请移除小程序重新载入尝试',
			  });
			});
			var that = this;
			// wx.getUserInfo({
			// 	success:(res) => {
			// 		console.log(res)
			// 		wx.login({
			// 			success:(loginres) => {
			// 				console.log(loginres)
			// 			}
			// 		})
			// 	}
			// })
			wx.checkSession({
			  success (res) {
			    //session_key 未过期，并且在本生命周期一直有效
				uni.getStorage({
					key:'loginInfo',
					success:(res)=>{
						if(!res.data.WXAccessToken || res.data == "") {
							wx.getUserInfo({
								success: function(res) {
									login(res).then((res) => {
										// uni.setStorage({
										// 	key:'loginInfo',
										// 	data:res.data.data
										// })
										that.$store.commit('changeStatelogin',res.data.data)
									})
								},
								fail: function(err) {
									// console.log('err', err)
								}
							})
						} else {
							that.$store.commit('changeStatelogin',res.data)
						}
						
					},
					fail:(err)=>{
						wx.getUserInfo({
							success: function(res) {
								login(res).then((res) => {
									// uni.setStorage({
									// 	key:'loginInfo',
									// 	data:res.data.data
									// })
									that.$store.commit('changeStatelogin',res.data.data)
								}).catch(() => {
									setTimeout(() => {
										login(res).then((res) => {
											// uni.setStorage({
											// 	key:'loginInfo',
											// 	data:res.data.data
											// })
											that.$store.commit('changeStatelogin',res.data.data)
										})
									},2000)
								})
							},
							fail: function(err) {
								// console.log('err', err)
							}
						})
					}
				})
			  },
			  fail (err) {
			    // session_key 已经失效，需要重新执行登录流程
				 console.log('err',err)
			    // wx.login() //重新登录
				wx.getUserInfo({
					success: function(res) {
						login(res).then((res) => {
							uni.setStorage({
								key:'loginInfo',
								data:res.data.data
							})
							that.$store.commit('changeStatelogin',res.data)
						})
					},
					fail: function(err) {
						// console.log('err', err)
					}
				})
			  }
			})
			
			if (uni.getStorageSync('language')) {
				this.$store.commit("changeStateLanguage", uni.getStorageSync('language'));
			}
			
		},
		onShow: function() {
			console.log('App Show')
			uni.showLoading()
			setTimeout(() => {
				uni.hideLoading()
			}, 1000)
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
