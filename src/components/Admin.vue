<template>
	<div>
		<el-container>
			<el-header>
				<el-avatar shape="square" class="avatar" :size="60" :src="avatar"></el-avatar>
				<h1 @click="admin">个人博客管理</h1>
				<el-button class="button" @click="logout" type="danger" plain round>退出登陆</el-button>
				<router-link to="/Home"><el-button class="home" type="text">Home</el-button></router-link>
			</el-header>

			<el-container>
				<el-aside :width="!folds ? '200px' : '70px'">
					<div v-show="!folds" class="foldbutton" @click="fold">折叠</div>
					<div v-show="folds" class="foldbutton" @click="fold">展开</div>
					<!-- unique-opened -->
					<el-menu
						background-color="#fffbee"
						text-color="#000000"
						active-text-color="#319aff"
						:collapse="folds"
						:collapse-transition="false"
						:router="true"
						:default-active="def"
					>
						<el-submenu :index="+item.id + ''" v-for="item in menuslists" :key="item.id">
							<template slot="title">
								<i :class="item.icon"></i>
								<span>{{ item.name }}</span>
							</template>
							<el-menu-item-group v-for="items in item.children" :key="items.id">
								<el-menu-item @click="defact" :index="'/' + items.path">
									<i :class="items.icon"></i>
									<span>{{ items.name }}</span>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</el-menu>
				</el-aside>
				<el-main>
					<!-- 子组件占位符 -->
					<router-view :key="key"></router-view>
				</el-main>
			</el-container>
			<el-footer style="height: 20px;">
				Copyright © 2020
				<br />
				www.lvqiangwei.com All rights reserved. 豫ICP备19040560号
			</el-footer>
		</el-container>
		<div class="back-to"><el-button type="primary" v-show="top" class="back-top" @click="backTop" plain round>UP</el-button></div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			top: false,
			avatar: '',
			def: '',
			folds: false,
			menuslists: [
				{
					id: '1',
					name: '博客',
					icon: 'el-icon-document',
					children: [
						{
							id: '1',
							name: '添加博客',
							icon: 'el-icon-document-add',
							path: 'editor'
						},
						{
							id: '2',
							name: '查看博客',
							icon: 'el-icon-document-copy',
							path: 'blog'
						},
						{
							id: '3',
							name: '查看草稿',
							icon: 'el-icon-document-copy',
							path: 'draft'
						}
					]
				},
				{
					id: '2',
					name: '用户',
					icon: 'el-icon-user',
					children: [
						{
							id: '1',
							name: '管理员列表',
							icon: 'el-icon-user',
							path: 'admins'
						},
						{
							id: '2',
							name: '用户列表',
							icon: 'el-icon-user',
							path: 'user'
						}
					]
				},

				{
					id: '3',
					name: '随笔',
					icon: 'el-icon-folder',
					children: [
						{
							id: '1',
							name: '随笔列表',
							icon: 'el-icon-tickets',
							path: 'essayList'
						}
					]
				}
			]
		};
	},

	methods: {
		admin() {
			this.$router.push('/admin');
		},
		logout() {
			window.sessionStorage.clear();
			window.localStorage.clear();
			this.$router.push('/home');
		},
		//     折叠导航栏
		fold() {
			this.folds = !this.folds;
		},
		defact(el) {
			window.sessionStorage.setItem('def', el.index);
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
		window.removeEventListener('scroll', this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll, true); // 监听（绑定）滚轮滚动事件
	},
	computed: {
		key() {
			return this.$route.path + Math.random();
		}
	},
	created() {
		if (!sessionStorage.getItem('token')) {
			this.$router.push('/login');
			this.$message.error('请登录');
		} else {
			if (sessionStorage.getItem('role') != 'admin') {
				this.$router.push('/home');
				this.$message.error('权限不足');
			}
		}
		this.def = sessionStorage.getItem('def');
		this.avatar = sessionStorage.getItem('avatar');
	}
};
</script>
<style lang="less" scoped>
* {
	padding: 0;
	margin: 0;
}
h1 {
	cursor: pointer;
}
.el-avatar {
	float: left;
	margin-left: 10px;
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

.el-menu {
	border: 0;
}
i {
	margin-right: 10px;
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
	margin: 10px 10px 0px 10px;
}
.el-header {
	text-align: center;
	line-height: 60px;
	height: 60px;
	padding-left: 0;

	h1 {
		margin-left: 20px;
		float: left;
	}
	.button {
		float: right;

		margin-top: 10px;
		margin-right: 30px;
	}
	.home {
		float: right;
		color: #000000;
		margin-top: 10px;
		padding: 10px 20px 10px 20px;
	}
	.home :hover {
		padding-left: 10px;
		color: #409eff;
	}
}

.foldbutton {
	margin-top: 30px;
	width: 100%;
	height: 50px;
	line-height: 30px;
	font-size: 20px;
	text-align: center;
	letter-spacing: 0.3em;
	cursor: pointer;
}
.foldbutton:hover {
	color: #409eff;
}
</style>
