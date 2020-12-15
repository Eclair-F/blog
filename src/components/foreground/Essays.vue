<template>
	<div>
		<div v-if="show">
			<el-row v-for="essay in essayList" :key="essay.id">
				<el-card shadow="hover">
					<el-row class="art-body">
						<div class="side-abstract">
							<i class="el-icon-date">:{{ essay.date }}</i>
							<div class="art-abstract">{{ essay.content }}</div>
						</div>
					</el-row>
				</el-card>
			</el-row>
		</div>
		<div v-else>暂无数据</div>
	</div>
</template>

<script>
export default {
	data() {
		return { show: false, essayList: [] };
	},
	methods: {
		//   获取博客列表
		async getEssayList() {
			const { data: res } = await this.axios.get('essay');
			if (!res.flag) return;
			this.show = true;
			this.essayList = res.data.rows;
			this.ellipsis();
		},
		ellipsis() {
			this.essayList.forEach((item, index) => {
				var value = item.content;
				value = value.replace(/<.*?>/g, ''); //去除HTML Tag
				value = value.replace(/[|]*\n/, ''); //去除行尾空格
				value = value.replace(/&nbsp;/gi, ''); //去掉nbsp
				this.essayList[index].content = value;
			});
		}
	},

	created() {
		this.getEssayList();
	}
};
</script>
<style scoped>
:hover {
	color: #409eff;
	cursor: pointer;
}

.el-card {
	padding-left: 20px;
	margin-bottom: 5px;

	background-color: #fffbee;

}
.art-body {
	display: flex;
	text-align: left;
}
</style>
