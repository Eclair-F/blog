<template>
	<div class="all">
		<div v-if="show">
			<el-row v-for="(blog, index) in blogList" :key="blog.id">
				<el-card shadow="hover">
					<el-row class="art-body">
						<div class="side-img hidden-sm-and-down" @click="article(blog.id)"><el-image class="art-banner" :src="blog.cover"></el-image></div>

						<div class="side-abstract">
							<div class="art-title" @click="article(blog.id)"><h2 v-html="blog.title"></h2></div>

							<div class="art-abstract" v-html="blog.content"></div>
							<div class="art-more" shadow="never"><el-button plain @click="article(blog.id)">阅读全文</el-button></div>
							<div class="art-more" shadow="never">
								<i class="el-icon-price-tag category" @click="toCategory(blog.category)">:{{ blog.category }}</i>
								<div>
									<i class="el-icon-timer view" shadow="never">:{{ blog.date }}</i>

									<i class="el-icon-chat-round view">{{ blog.commentNum }}</i>

									<i class="el-icon-view view">{{ blog.view }}</i>

									<i class="el-icon-thumb " @click="praise(blog, index)">{{ blog.praise }}</i>
								</div>
							</div>
						</div>
					</el-row>
				</el-card>
			</el-row>

			<!-- 分页导航栏 -->

			<el-pagination
				@size-change="handleSizeChange"
				:current-page.sync="currentPage"
				:hide-on-single-page="false"
				:page-sizes="[5, 10, 20]"
				:page-size="pageSize"
				layout="total, sizes"
				:total="total"
			></el-pagination>
			<el-button-group>
				<el-button type="primary" icon="el-icon-arrow-left" @click="pageUp" v-show="up">上一页</el-button>
				<el-button type="primary" @click="pageDown" v-show="down">
					下一页
					<i class="el-icon-arrow-right el-icon--right"></i>
				</el-button>
			</el-button-group>
		</div>
		<div v-else>暂无数据</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			up: true,
			down: true,
			currentPage: 1,
			category: '',
			sub: 130,
			search: '',
			blogList: [],
			query: {
				id: '',
				pageSize: '5'
			},
			total: 0,
			pageSize: 0,
			state: '',
			info: {
				id: '',
				praise: ''
			}
		};
	},
	methods: {
		//   获取博客列表
		async getBlogList() {
			var url = 'blog';

			if (this.$route.params.category != null && this.$route.params.category.length > 0) {
				url = url + '/category';
				this.search = this.$route.params.category;
			} else if (this.$route.params.search != null && this.$route.params.search.length > 0) {
				url = url + '/search';
				this.search = this.$route.params.search;
			}

			if (this.state.length > 0) {
				if (this.state == 'down') {
					url = url + '/down';
				} else {
					if (this.state == 'up') {
						url = url + '/up';
					}
				}
			}

			if (this.query.pageSize.length > 0) {
				url = url + '/' + this.query.pageSize;
				if (this.search.length > 0) {
					url = url + '/' + this.search;
				}
				if (this.query.id.length > 0) {
					url = url + '/' + this.query.id;
				}
			}

			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				this.blogList = null;
				this.total = null;
				return;
			}
			this.show = true;
			this.blogList = res.data.rows;
			this.total = res.data.total;
			this.pageSize = res.data.pageSize;
			if (this.total / this.pageSize <= this.currentPage) this.down = false;
			if (this.currentPage <= 1) {
				this.up = false;
			}
			this.ellipsis();
		},
		ellipsis() {
			this.blogList.forEach((item, index) => {
				var value = item.content;
				var title = item.title;
				var l = this.sub;
				value = value.replace(/<.*?>/g, ''); //去除HTML Tag
				value = value.replace(/[|]*\n/, ''); //去除行尾空格
				value = value.replace(/&nbsp;/gi, ''); //去掉npsp
				if (this.$route.params.search != null && this.$route.params.search.length > 0) {
					var titlenum = title.indexOf(this.search);
					if (titlenum == 0) {
						this.blogList[index].title = '<span style="color: #FF0000;">' + this.search + '</span>' + title.substring(this.search.length);
					} else if (titlenum > 0) {
						this.blogList[index].title =
							title.substring(0, titlenum) + '<span style="color: #FF0000;">' + this.search + '</span>' + title.substring(titlenum + this.search.length);
					}
					var num = value.indexOf(this.search);
					if (num == 0) {
						this.blogList[index].content = '<span style="color: #FF0000;font-size:20px;">' + this.search + '</span>' + value.substring(this.search.length, l) + '...';
					} else if (num > 0) {
						if (num < l) {
							this.blogList[index].content =
								value.substring(0, num) +
								'<span style="color: #FF0000;font-size:20px;">' +
								this.search +
								'</span>' +
								value.substring(num + this.search.length, l) +
								'...';
						} else {
							this.blogList[index].content =
								value.substring(num - 20, num) +
								'<span style="color: #FF0000;">' +
								this.search +
								'</span>' +
								value.substring(num + this.search.length, num + l - 20) +
								'...';
						}
					} else {
						if (value.length > l) {
							this.blogList[index].content = value.substring(0, l) + '...';
						} else {
							this.blogList[index].content = value;
						}
					}
				} else {
					if (value.length > l) {
						this.blogList[index].content = value.substring(0, l) + '...';
					} else {
						this.blogList[index].content = value;
					}
				}
			});
		},
		//     切换每页显示用户数量
		handleSizeChange(newsize) {
			this.query.pageSize = newsize.toString();
			this.query.id = '';
			this.state = '';
			this.getBlogList();
			this.top();
		},
		//     上一页
		pageUp() {
			this.state = 'up';
			this.query.id = this.blogList[0].id;
			this.currentPage -= 1;
			this.down = true;
			this.getBlogList();
			this.top();
		},
		//    下一页
		pageDown() {
			this.state = 'down';
			this.query.id = this.blogList[this.blogList.length - 1].id;
			this.currentPage += 1;
			this.up = true;
			this.getBlogList();
			this.top();
		},
		top() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		},

		toCategory(category) {
			this.$router.push('/category/' + category);
		},
		async praise(blog, index) {
			var info = {
				id: blog.id,
				praise: blog.praise + 1
			};
			this.blogList[index].praise = info.praise;
			await this.axios.put('blog/information', info);
		},
		article(id) {
			this.$router.push('/article/' + id);
		}
	},

	created() {
		this.getBlogList();
	}
};
</script>
<style scoped>
:hover {
	color: #409eff;
	cursor: pointer;
}

.el-card {
	background-color: #fffbee;
	margin-bottom: 10px;
}
.art-body {
	display: flex;
	height: 200px;
	padding: 10px 0;
}
.side-img {
	height: 150px;
	width: 230px;
	overflow: hidden;
	margin-right: 10px;
}
img.art-banner {
	width: 100%;
	height: 100%;
	transition: all 0.6s;
}
img.art-banner:hover {
	padding-left: 10px;
	color: #409eff;
}

.side-abstract {
	flex: 1;

	display: flex;
	flex-direction: column;
}
.art-title {
	text-align: left;
	border-left: 3px solid #f56c6c;
	padding-left: 5px;
	cursor: pointer;
}

.art-title:hover {
	padding-left: 10px;
	color: #409eff;
}

.art-abstract {
	font-size: 15px;
	text-align: left;
	flex: 1;
	color: #aaa;
}
.art-more {
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.art-more .view {
	margin: 0px 5px 0px 5px;
	text-align: right;
	color: #000000;
}
.category {
	color: #0000ff;
}
.category:hover {
	color: #00ff80;
	cursor: pointer;
}
.pagination {
	background-color: #f9f9f9;
}
#side .item {
	margin-bottom: 30px;
}
</style>
