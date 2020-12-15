<template>
	<div>
		<el-carousel :interval="5000" arrow="hover" height="200px">
			<el-carousel-item v-for="item in imageList" :key="item">
				<template>
					<img :src="item" alt="" />
				</template>
			</el-carousel-item>
		</el-carousel>
		<!-- 表格区域 -->
		<div>
			<el-input prefix-icon="el-icon-search" placeholder="请输入内容" class="input-with-select" v-model="search" clearable @clear="clear" @keyup.enter.native="searchBlog">
				<el-button slot="append" icon="el-icon-search" @click="searchBlog"></el-button>
			</el-input>
		</div>
		<div class="title" v-show="blogList">最新文章</div>
		<div v-for="blog in blogList" :key="blog.id" class="title">
			<el-link class="name" @click="article(blog.id)" :underline="false">·{{ blog.title }}</el-link>
		</div>
		<div>
			<audio autoplay="autoplay" loop="loop" controls="controls" :src="musicList[music]"></audio>
			<el-button @click="changeMusic">切歌</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'tag',
	data() {
		return {
			imageList: [require('../../assets/img/1.png'), require('../../assets/img/2.png'), require('../../assets/img/3.png'), require('../../assets/img/4.png')],
			blogList: [],
			search: '',
			music: 0,
			musicList: [
				require('../../../public/media/回梦游仙.mp3'),
				require('../../../public/media/town.mp3'),
				require('../../../public/media/莫失莫忘.mp3')
			]
		};
	},
	methods: {
		//   获取博客列表
		async getBlogList() {
			var url = 'blog/5';
			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				return ;
			}
			this.blogList = res.data.rows;
		},
		article(id) {
			this.$router.push('/article/' + id);
		},
		searchBlog() {
			this.$router.push('/search/' + this.search);
		},
		clear() {
			this.search = '';
			this.$router.push('/home');
		},
		changeMusic() {
			this.music = parseInt(Math.random() * this.musicList.length, 10);
		}
	},
	created() {
		this.getBlogList();
		this.changeMusic();
	}
};
</script>

<style scoped>
.title {
	text-align: left;
	margin-left: 20px;
	margin-top: 10px;
	margin-bottom: 10px;
}
.name {
	font-size: 16px;
}
.el-carousel {
	margin-bottom: 20px;
}
.el-carousel__item {
	color: #475669;
	font-size: 18px;
	opacity: 0.75;
	line-height: 200px;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
</style>
