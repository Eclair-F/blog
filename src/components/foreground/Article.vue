<template>
	<div>
		<div v-if="article">
			<el-row>
				<el-card>
					<el-row class="title">{{ blog.title }}</el-row>
					<el-row class="authorInfo">
						<i class="el-icon-price-tag category" @click="category(blog.category)">:{{ blog.category }}</i>
						<i class="el-icon-date date">:{{ blog.date }}</i>
					</el-row>
					<el-row class="content"><div class="ql-editor" v-html="blog.content"></div></el-row>
					<el-row class="info">
						本博客发布于:{{ blog.date }}
					</el-row>
				</el-card>
				<Comment :id="id" :commentNum="blog.commentNum"></Comment>
			</el-row>
		</div>
		<div v-else>暂无</div>
	</div>
</template>

<script>
import Comment from './Comment.vue';
export default {
	components: {
		Comment
	},
	data() {
		return {
			article: true,
			id: this.$route.params.id,
			blog: {},
			commentInput: {
				blogId: this.$route.params.id,
				content: '',
				userId: window.sessionStorage.getItem('id')
			}
		};
	},
	methods: {
		async getBlog(id) {
			if (id.length > 0) {
				const { data: res } = await this.axios.get('blog/id/' + id);
				if (!res.flag) return (this.article = false);
				this.blog = res.data;
				this.view();
			}
		},
		category(path) {
			this.$router.push('/category/' + path);
		},
		async view() {
			var info = {
				id: this.blog.id,
				view: this.blog.view + 1
			};
			this.blog.view += 1;
			await this.axios.put('blog/information', info);
		},
		async praise() {
			var info = {
				id: this.blog.id,
				praise: this.blog.praise + 1
			};
			this.blog.praise += 1;
			await this.axios.put('blog/information', info);
		}
	},
	created() {
		if (this.$route.params.id != null) {
			this.getBlog(this.$route.params.id);
		} else {
			this.$router.push('/home');
		}
	}
};
</script>
<style scoped>

.el-card {
	background-color: #fffbee;
	margin-bottom: 10px;
}
.title {
	font-size: 32px;
}
.authorInfo {
	text-align: left;
}
.category {
	margin: 0px 20px 0px 20px;
}
.category:hover {
	color: #409eff;
	cursor: pointer;
}
.date {
	margin: 0px 20px 0px 20px;
}
.view {
	float: right;
	margin: 0px 30px 0px 0px;
}
.content {
	text-align: left;
}
</style>
