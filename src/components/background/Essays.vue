<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>随笔列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card class="card">
			<!-- 添加随笔区域 -->
			<el-row >
				<el-button style="float: right;" type="primary" @click="addDialogVisible = true" >添加随笔</el-button>
			</el-row>
			<!-- 表格区域 -->
			<el-table border style="width: 100%" class="tables" :data="essaysList">
				<el-table-column type="index" label="#" width="60"></el-table-column>
				<el-table-column prop="content" label="内容"></el-table-column>
				<el-table-column prop="date" label="时间" width="160"></el-table-column>
				<el-table-column label="操作" width="120px">
					<template slot-scope="scope">
						<!-- 操作按钮 -->
						<!-- {{scope.row.id}} -->
						<el-tooltip class="item" effect="dark" content="查看" placement="top-start" :enterable="false">
							<el-button type="primary" icon="el-icon-edit" @click="checkEssay(scope.row)" size="small"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
							<el-button type="danger" icon="el-icon-delete" @click="delectEssay(scope.row.id)" size="small"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 弹出的添加随笔对话框 -->
		<el-dialog title="添加随笔" :visible.sync="addDialogVisible" width="40%" @close="addClosed">
			<el-form ref="addref" :model="essay">
				<el-form-item>
					<el-input type="textarea" :autosize="{ minRows: 4 }" v-model="essay.content" placeholder="请输入内容" maxlength="100" show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addEssay">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出的查看随笔的对话框 -->
		<el-dialog title="查看随笔" :visible.sync="checkDialogVisible" @close="checkClosed" width="40%">
			<el-form ref="checkref" :model="cEssay" label-width="80px">
				<el-form-item label="内容">{{ cEssay.content }}</el-form-item>
				<el-form-item label="时间">{{cEssay.date }}</el-form-item>
			</el-form>

			<span slot="footer"><el-button @click="checkDialogVisible = false">关 闭</el-button></span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			essaysList: [],
			// 添加随笔的显示与隐藏
			addDialogVisible: false,
			// 查看随笔的显示与隐藏
			checkDialogVisible: false,
			// 添加随笔的表单数据
			essay: {
				content: ''
			},
			cEssay: {
				date: '',
				content: ''
			}
		};
	},
	methods: {
		//   获取随笔列表
		async getEssayList() {
			const { data: res } = await this.axios.get('essay');
			if (!res.flag) return this.$message.error(res.message);
			this.essaysList = res.data.rows;
		},

		//     监听新建随笔弹出框关闭时的事件
		addClosed() {
			this.essay.content = '';
		},
		//     点击确定按钮后触发
		async addEssay() {
			if (!this.essay.content) {
				this.$message({
					showClose: true,
					type: 'warning',
					message: '不能为空'
				});
			} else {
			//   进行添加随笔
			const { data: res } = await this.axios.post('essay', this.essay);
			if (!res.flag) return this.$message.error(res.message);
			this.$message.success('添加成功');
			this.addDialogVisible = false;
			this.getEssayList();}
		},
		//     查看随笔方法
		checkEssay(essay) {
			this.checkDialogVisible = true;
			this.cEssay = essay;
		},
		//     监听查看随笔弹出框关闭时的事件
		checkClosed() {
			//	this.$refs.checkref.resetFields();
			this.cEssay = '';
		},

		//     删除随笔操作
		async delectEssay(id) {
			const res = await this.$confirm('此操作将永久删除该条随笔, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (res == 'confirm') {
				const { data: res } = await this.axios.delete('essay/' + id);
				if (!res.flag) return this.$message.error(res.message);
				this.getEssayList()();
				this.$message.success('删除成功！！');
			} else {
				this.$message.info('已取消删除');
			}
		}
	},
	created() {
		this.getEssayList();
	}
};
</script>
<style lang="less" scoped>
.card {
	margin-top: 20px;
}

.tables {
	margin-top: 20px;
	margin-bottom: 20px;
}
p {
	margin: 10px 0;
}
</style>
