import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import './plugins/element.js'
// 导入全局css样式表
import './assets/css/global.css'
// 导入字体图标样式库
import './assets/fonts/iconfont.css'
// 导入axios,并配置
import axios from 'axios'


// 导入NProgress  js和css包
import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'

//配置axios
//axios.defaults.timeout = 1000;

axios.defaults.baseURL = "http://127.0.0.1:8601/";
//axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
	// 在发起axios的时候展示进度条
	NProgress.start()
	var token = window.sessionStorage.getItem('token');
	if (token != null) {
		config.headers.Authentication = token;
	}
	return config;
})

//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 1;
axios.defaults.retryDelay = 1000;


axios.interceptors.response.use(config => {
	NProgress.done()
	return config
}, err => {
	NProgress.done()
	var config = err.config;
	// If config does not exist or the retry option is not set, reject
	if (!config || !config.retry) return;

	// Set the variable for keeping track of the retry count
	config.__retryCount = config.__retryCount || 0;

	// Check if we've maxed out the total number of retries
	if (config.__retryCount >= config.retry) {
		// Reject with the error
		return;
	}

	// Increase the retry count
	config.__retryCount += 1;

	// Create new promise to handle exponential backoff
	var backoff = new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, config.retryDelay || 1);
	});

	// Return the promise in which recalls axios to retry the request
	return backoff.then(function() {
		return;
	});

})
Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.prototype.resetSetItem = function(key, newVal) {
	if (key === 'avatar') {

		// 创建一个StorageEvent事件
		var newStorageEvent = document.createEvent('StorageEvent');
		const storage = {
			setItem: function(k, val) {
				sessionStorage.setItem(k, val);

				// 初始化创建的事件
				newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

				// 派发对象
				window.dispatchEvent(newStorageEvent)
			}
		}
		return storage.setItem(key, newVal);
	}
}

//自定义指令
Vue.directive('reClick', {
	inserted(el, binding) {
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true
				setTimeout(() => {
					el.disabled = false
				}, binding.value || 3000)
			}
		})
	}
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
