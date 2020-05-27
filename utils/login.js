const api = 'https://dsfs.squareent.com';
import store from '../store'
// 改变stroe 数据
let num = 0;
export function login(e) {
	return new Promise(function (resolve, reject) {
		uni.login({
			provider: 'weixin',
			success: function (loginRes) {
				console.log(loginRes.code);
				var data = {
					code: loginRes.code,
					encryptedData: e.encryptedData,
					ivStr: e.iv
				}
				wx.request({
					url: api + '/wechat/user/login', //仅为示例，并非真实接口地址。
					data: data,
					method: 'POST',
					header: {
						'content-type': 'application/json'
						// 'token-session': '' //自定义请求头信息
					},
					success: (res) => {
						if(res.data.code == 505) {
							num +=1
							if(num < 5) {
								setTimeout(() => {
								wx.getUserInfo({
										success: function(res) {
											login(res).then((res) => {
												// uni.setStorage({
												// 	key:'loginInfo',
												// 	data:res.data.data
												// })
												store.commit('changeStatelogin',res.data.data)
											}).catch(() => {
												setTimeout(() => {
													login(res).then((res) => {
														// uni.setStorage({
														// 	key:'loginInfo',
														// 	data:res.data.data
														// })
														store.commit('changeStatelogin',res.data.data)
													})
												},2000)
											})
										},
										fail: function(err) {
											// console.log('err', err)
										}
									})
								},200)
							}
							
						}
						resolve(res)
					},
					fail: (err) => {
						reject(err);
					}
				});
			}
		});
	})
}
