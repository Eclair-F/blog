import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局css样式表
import './assets/css/global.css'
// 导入字体图标样式库
import './assets/fonts/iconfont.css'
// 导入axios,并配置
import axios from 'axios'
//配置cookies
import Cookies from 'vue-cookies'
//配置axios
axios.defaults.baseURL = "http://127.0.0.1:8081/";
//axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
	// 在发起axios的时候展示进度条
	//  NProgress.start()
	var token=window.sessionStorage.getItem('token');
	if(token!=null)
	{
	config.headers.Authentication = token;
	}
	//console.log(config)
	return config;
})
// axios.interceptors.response.use(config => {
//       NProgress.done()
//       return config
// })
Vue.prototype.axios = axios;
Vue.config.productionTip = false;

// // 配置cookie
// import cookie from 'vue-cookies'
// Vue.prototype.$cookie = cookie;

//配置cookies
Vue.use(Cookies);
// 30 day after, expire
Vue.$cookies.config('3d');


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
