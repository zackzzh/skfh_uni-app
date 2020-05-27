import Vue from 'vue'
import App from './App'
import pageFoot from './components/page-foot.vue'
import store from './store'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.basaApi = 'https://dsfs.squareent.com'
Vue.prototype.$store = store
// Vue.prototype.loginInfo = {}
Vue.component('page-foot', pageFoot)
const app = new Vue({
	...App,
	store
})
app.$mount()
