<template>
	<div>
		<el-form ref="addref" :model="essay">
			<el-form-item>
				<el-input type="textarea" :autosize="{ minRows: 4 }" v-model="essay.content" placeholder="请输入内容" maxlength="100" show-word-limit></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer">
			<el-button type="primary" @click="addEssay">确 定</el-button>
		</span>
	</div>
</template>
<script>
export default {
	data() {
		return {
			essay: {
				content: ''
			}
		};
	},
	methods: {
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
				this.$router.go(-1);
			}
		}
	}
};
</script>
<style lang="less" scoped></style>
