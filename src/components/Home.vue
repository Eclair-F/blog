<template>
	<div>
		<el-container>
			<el-header>
				<router-link to="/login"><el-button v-if="!out" class="button" type="success" plain round>登陆</el-button></router-link>
				<router-link to="/register"><el-button v-if="!out" class="button" plain round>注册</el-button></router-link>
				<router-link to="/Home"><el-button class="home" type="text" style="margin-bottom: 0;">Home</el-button></router-link>
				<router-link to="/userinfo">
					<el-tooltip content="查看个人信息" placement="bottom" effect="light">
						<el-avatar v-if="out" shape="square" class="avatar" :size="60" :src="avatar"></el-avatar>
					</el-tooltip>
				</router-link>
				<el-button v-if="out" class="button" @click="logout" type="danger" plain round>退出登陆</el-button>
			</el-header>
			<el-header class="NavMenu">
				<div v-for="item in menuslists" :key="item.id" class="title">
					<el-link @click="category(item.path)" class="name" :underline="false">{{ item.name }}</el-link>
				</div>
			</el-header>
			<el-container >
				<el-main id="main">
					<!-- 子组件占位符 -->
					<router-view :key="key"></router-view>
				</el-main>
				<el-aside width="300px">
					<div><tag></tag></div>
				</el-aside>
			</el-container>
			<el-footer>
				Copyright © 2020
				<br />
				www.lvqiangwei.com All rights reserved. 豫ICP备19040560号
			</el-footer>
		</el-container>
		<div class="back-to"><el-button type="primary" v-show="top" class="back-top" @click="backTop" plain round>UP</el-button></div>
	</div>
</template>
<script>
import tag from './foreground/tag.vue';
export default {
	components: {
		tag
	},
	data() {
		return {
			top: false,
			out: false,
			avatar: '',
			menuslists: [
				{
					id: '1',
					name: '首页',
					path: 'home'
				},
				{
					id: '2',
					name: '韶华追忆',
					path: 'category/韶华追忆'
				},
				{
					id: '3',
					name: '技术分享',
					path: 'category/技术分享'
				},
				{
					id: '4',
					name: '心情随笔',
					path: 'essays'
				},
				{
					id: '5',
					name: 'Blog留言',
					path: 'message'
				}
			]
		};
	},

	computed: {
		key() {
			return this.$route.path + Math.random();
		}
	},

	methods: {
		category(path) {
			this.$router.push('/' + path);
		},
		logout() {
			sessionStorage.clear();
			localStorage.clear();
			this.out = false;
			location.reload();
		},

		handleScroll() {
			if (document.documentElement.scrollTop > 500) {
				this.top = true;
			} else {
				this.top = false;
			}
		},
		backTop() {
			document.documentElement.scrollTop = 0;
		}
	},
	destroyed() {
		removeEventListener('scroll', this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
	},
	mounted() {
		addEventListener('scroll', this.handleScroll, true); // 监听（绑定）滚轮滚动事件
	},
	created() {
		window.addEventListener('setItem', ()=> {
			this.avatar = sessionStorage.getItem('avatar');
		});
		if (localStorage.getItem('token') != null && localStorage.getItem('date') != null) {
			if (localStorage.getItem('date') < new Date().getTime()) {
				localStorage.clear();
			}
			var data = JSON.parse(localStorage.getItem('data'));
			sessionStorage.setItem('token', localStorage.getItem('token'));
			sessionStorage.setItem('role', data.role);
			sessionStorage.setItem('id', data.id);
			sessionStorage.setItem('nickname', data.nickname);
			sessionStorage.setItem('avatar', data.avatar);
			this.avatar = data.avatar;
			this.out = true;
			if (sessionStorage.getItem('role') == 'admin') {
				this.menuslists.push(
					{
						id: '6',
						name: '后台管理',
						path: 'admin'
					},
					{
						id: '7',
						name: '添加博客',
						path: 'editors'
					},
					{
						id: '8',
						name: '添加随笔',
						path: 'essay'
					}
				);
			}
		}
	}
};
</script>
<style lang="less" scoped>
* {
	padding: 0;
	margin: 0;
}

.back-to {
	bottom: 55px;
	overflow: hidden;
	position: fixed;
	right: 10px;
	width: 110px;
	z-index: 999;
}
.back-to .back-top {
	display: block;
	float: right;
	margin-right: 20px;
}
.back-to .back-top:hover {
	background-position: -50px 0;
}

.NavMenu {
	align-self: center;
}
.title {
	float: left;
	margin: 10px;
	.name {
		font-size: 25px;
	}
}
.el-header {
	text-align: right;
	line-height: 60px;
	height: 60px;
	margin: 10px 100px 20px 100px;

	.home {
		color: black;
		margin-right: 20px;
		height: 20px;
		padding: 10px 20px 10px 20px;
	}
	.home :hover {
		padding-left: 10px;
		color: #409eff;
	}
	.button {
		color: red;
		vertical-align: middle;
		margin-right: 20px;
	}
	.avatar {
		margin-right: 30px;
		vertical-align: bottom;
	}
}
.backTop {
	float: right;
}
.el-aside {
	margin-right: 200px;
}
.el-container {
	background-color: #fffbee;
	position: relative;
	padding-bottom: 40px;
	min-height: 90vh;
}
.el-footer {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	text-align: center;
}

.el-main {
	margin: 0px 10px 0px 200px;	
}
</style>
