import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		loginInfo: {

		},
		address: '',
		language: 'zh'
	},
	mutations: {
		changeStateAddress(state, data) {
			state.address = data
		},
		changeStatelogin(state,data) {
			state.loginInfo = data
			uni.setStorageSync("loginInfo",data)
		},
		changeStateLanguage(state,data) {
			state.language = data
			uni.setStorageSync('language', data)
		}
	},
	actions: {}
})
export default store
