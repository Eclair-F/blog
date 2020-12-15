<template>
	<div class=".el-scrollbar__wrap">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>博客列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card class="card">
			<!-- 添加博客区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input prefix-icon="el-icon-search" placeholder="请输入内容" class="input-with-select" v-model="search" clearable @clear="clear">
						<el-button slot="append" icon="el-icon-search" @click="getBlogList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="16"><el-button type="primary" @click="addBlog">添加博客</el-button></el-col>
			</el-row>
			<!-- 表格区域 -->
			<el-table border style="width: 100%" class="tables" :data="blogList">
				<el-table-column type="index" label="#" width="60"></el-table-column>
				<el-table-column prop="title" label="题目" width="200"></el-table-column>
				<el-table-column prop="category" label="类别" width="80"></el-table-column>
				<el-table-column prop="content" label="内容"></el-table-column>
				<el-table-column prop="view" label="观看" width="50"></el-table-column>
				<el-table-column prop="praise" label="点赞" width="50"></el-table-column>
				<el-table-column prop="commentNum" label="评论数" width="70"></el-table-column>
				<el-table-column prop="date" label="时间" width="160"></el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 操作按钮 -->
						<!-- {{scope.row.id}} -->
						<el-tooltip class="item" effect="dark" content="编辑" placement="left" :enterable="false">
							<el-button type="primary" icon="el-icon-edit" @click="updateBlog(scope.row.id)" size="small"></el-button>
						</el-tooltip>

						<el-tooltip class="item" effect="dark" content="存为草稿" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-document" @click="toDraft(scope.row.id)" size="small"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="right" :enterable="false">
							<el-button type="danger" icon="el-icon-delete" @click="deleteBlog(scope.row.id)" size="small"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页导航栏 -->
			<!-- 分页导航栏 -->
			<div v-show="page">
				<el-pagination
					@size-change="handleSizeChange"
					:hide-on-single-page="false"
					:current-page.sync="currentPage"
					:page-sizes="[5, 10, 20]"
					:page-size="pageSize"
					layout="total, sizes "
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
		</el-card>
	</div>
</template>
<script>
export default {
	data() {
		return {
			page: true,
			up: true,
			down: true,
			sub: 20,
			currentPage: 1,
			search: '',
			blogList: [],
			query: {
				id: '',
				pageSize: '5'
			},
			total: 0,
			pageSize: 0,
			state: ''
		};
	},
	methods: {
		//   获取博客列表
		async getBlogList() {
			var url = 'blog';
			if (this.search.length > 0) {
				url = url + '/search';
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
				this.page = false;
				return ;
			}
			this.blogList = res.data.rows;
			this.total = res.data.total;
			this.pageSize = res.data.pageSize;
			this.ellipsis();
			if (this.total / this.pageSize <= this.currentPage) this.down = false;
			if (this.currentPage <= 1) {
				this.up = false;
			}
		},
		clear() {
			this.query.id = '';
			this.state = '';
			this.getBlogList();
		},
		//     切换每页显示博客数量
		handleSizeChange(newsize) {
			this.query.pageSize = newsize.toString();
			this.query.id = '';
			this.state = '';
			this.getBlogList();
		},
		//     上一页
		pageUp() {
			this.state = 'up';
			this.query.id = this.blogList[0].id;
			this.currentPage -= 1;
			this.down = true;
			this.getBlogList();
		},
		//    下一页
		pageDown() {
			this.state = 'down';
			this.query.id = this.blogList[this.blogList.length - 1].id;
			this.currentPage += 1;
			this.up = true;
			this.getBlogList();
		},

		ellipsis() {
			this.blogList.forEach((item, index) => {
				var value = item.content;
				var l = this.sub;
				value = value.replace(/<.*?>/g, ''); //去除HTML Tag
				value = value.replace(/[|]*\n/, ''); //去除行尾空格
				value = value.replace(/&nbsp;/gi, ''); //去掉npsp

				if (value.length > l) {
					this.blogList[index].content = value.substring(0, l) + '...';
				} else {
					this.blogList[index].content = value;
				}
			});
		},
		//     点击确定按钮后触发
		addBlog() {
			this.$router.push('/editor');
		},
		//     修改博客方法
		updateBlog(id) {
			this.$router.push('/update/' + id);
		},
		//     删除博客操作
		async deleteBlog(id) {
			const res = await this.$confirm('此操作将永久删除该条博客, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (res == 'confirm') {
				const { data: res } = await this.axios.delete('blog/' + id);
				if (!res.flag) return this.$message.error(res.message);
				this.getBlogList();
				this.$message.success('删除成功！！');
				const { data: resp } = await this.axios.delete('comment/' + id);
				if (!resp.flag) return;
				this.$message.success('评论删除成功！！');
			} else {
				this.$message.info('已取消删除');
			}
		},

		// 存为草稿
		async toDraft(id) {
			const res = await this.$confirm('此操作将该条博客存为草稿并删除评论, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (res == 'confirm') {
				const { data: res } = await this.axios.put('blog/' + id);
				if (!res.flag) return this.$message.error(res.message);
				this.getBlogList();
				this.$message.success('存储成功！！');
				const { data: resp } = await this.axios.delete('comment/' + id);
				if (!resp.flag) return;
				this.$message.success('评论删除成功！！');
			} else {
				this.$message.info('已取消操作');
			}
		}
	},
	created() {
		this.getBlogList();
	}
};
</script>
<style lang="less" scoped>
.card {
	margin-top: 20px;
}
.seach {
	width: 300px;
}
.tables {
	margin-top: 20px;
	margin-bottom: 20px;
}
p {
	margin: 10px 0;
}
</style>
