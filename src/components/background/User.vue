<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>

			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card class="card">
			<!-- 添加用户区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input prefix-icon="el-icon-search" placeholder="请输入内容" class="input-with-select" v-model="username" clearable @clear="clear">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="16"><el-button type="primary" @click="addDialogVisible = true">添加用户</el-button></el-col>
			</el-row>
			<!-- 表格区域 -->
			<el-table border style="width: 100%" class="tables" :data="userslist">
				<el-table-column type="index" label="#" width="60"></el-table-column>
				<el-table-column prop="username" label="用户名"></el-table-column>
				<el-table-column prop="nickname" label="昵称"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="mobile" label="电话" width="120"></el-table-column>
				<el-table-column prop="sex" label="性别" width="80"></el-table-column>
				<el-table-column prop="date" label="注册日期" width="160"></el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 操作按钮 -->
						<!-- {{scope.row.id}} -->
						<el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
							<el-button type="primary" icon="el-icon-edit" @click="alterUser(scope.row.id)" size="small"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
							<el-button type="danger" icon="el-icon-delete" @click="delectuser(scope.row.id)" size="small"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="提升权限" placement="right" :enterable="false">
							<el-button type="warning" icon="el-icon-s-tools" @click="updateRoles(scope.row)" size="small"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页导航栏 -->
			<div v-show="page">
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
		</el-card>
		<!-- 弹出的添加用户对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addClosed">
			<el-form label-width="80px" :rules="addformRule" :model="addform" ref="addref">
				<el-form-item label="用户名" prop="username"><el-input v-model="addform.username"></el-input></el-form-item>
				<el-form-item label="昵称" prop="nickname"><el-input v-model="addform.nickname"></el-input></el-form-item>
				<el-form-item label="密码" prop="password"><el-input v-model="addform.password" type="password"></el-input></el-form-item>
				<el-form-item label="确认密码" prop="checkpassword"><el-input v-model="addform.checkpassword" type="password"></el-input></el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="addform.sex">
						<el-radio-button label="男"></el-radio-button>
						<el-radio-button label="女"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮箱" prop="email"><el-input v-model="addform.email" maxlength="32"></el-input></el-form-item>
				<el-form-item label="手机" prop="mobile"><el-input v-model="addform.mobile" maxlength="11"></el-input></el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出的修改用户的对话框 -->
		<el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" @close="updateClosed" width="40%">
			<el-form label-width="80px" :model="alerlist" :rules="addformRule" ref="uodateref">
				<el-form-item label="用户名" prop="">{{ alerlist.username }}</el-form-item>
				<el-form-item label="昵称" prop="nickname"><el-input v-model="alerlist.nickname"></el-input></el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="alerlist.sex">
						<el-radio-button label="男"></el-radio-button>
						<el-radio-button label="女"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮箱" prop="email"><el-input v-model="alerlist.email" maxlength="32"></el-input></el-form-item>
				<el-form-item label="手机" prop="mobile"><el-input v-model="alerlist.mobile" maxlength="11"></el-input></el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="updateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 提升权限对话框 -->
		<el-dialog title="分配角色" :visible.sync="allotJurisdictionCase" width="40%">
			<el-form label-width="80px" :model="row" ref="uodateref">
				<el-form-item label="用户名" prop="">{{ row.username }}</el-form-item>
				<el-form-item label="昵称" prop="nickname">{{ row.nickname }}</el-form-item>
			</el-form>
			<el-switch
				style="display: block"
				v-model="role"
				active-color="#ff4949"
				inactive-color="#13ce66"
				active-text="提升为Admin"
				inactive-text="当前权限User"
				@change="roleChange"
			></el-switch>
			<span slot="footer">
				<el-button @click="allotJurisdictionCase = false">取 消</el-button>
				<el-button type="primary" @click="rolesConfirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		//   验证邮箱的规则
		const checkEmail = (rule, value, cb) => {
			const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (regEmail.test(value)) {
				return cb();
			}
			return cb(new Error('请输入正确的邮箱'));
		};
		//确认密码
		const checkPass = (rule, value, cb) => {
			if (value == '') {
				cb(new Error('请再次输入密码'));
			} else if (value != this.addform.password) {
				cb(new Error('两次输入密码不一致!'));
			} else {
				cb();
			}
		};
		//   验证用户名
		const checkUsername = async (rule, value, cb) => {
			var url = '/user/exist/' + value;
			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				return cb();
			}
			return cb(new Error('用户名已被使用'));
		};
		//     手机号的验证规则
		const checkPhone = (rule, value, cb) => {
			const regPhone = /^(1)\d{10}$/;
			if (regPhone.test(value)) {
				return cb();
			}
			return cb(new Error('请输入正确的手机号'));
		};
		return {
			page: true,
			up: true,
			down: true,
			currentPage: 1,
			username: '',
			userslist: [],
			query: {
				id: '',
				pageSize: '5'
			},
			total: 0,
			pageSize: 0,
			state: '',
			input: '',
			role: false,

			// 添加用户的显示与隐藏
			addDialogVisible: false,
			// 修改用户的显示与隐藏
			updateDialogVisible: false,
			// 分配角色对话框显示与隐藏
			allotJurisdictionCase: false,
			// 添加用户的表单数据
			addform: {
				username: '',
				nickname: '',
				password: '',
				checkpassword: '',
				role: 'user',
				sex: '',
				email: '',
				mobile: ''
			},
			// 修改用户的表单数据
			alerlist: {
				id: '',
				username: '',
				nickname: '',
				sex: '',
				email: '',
				mobile: ''
			},
			// 修改权限
			row: {
				id: '',
				role: ''
			},

			// 添加用户表单数据的验证规则
			addformRule: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkUsername, trigger: 'blur' }
				],
				nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				checkpassword: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkPass, trigger: 'blur' }
				],
				sex: [{ required: true, message: '请输选择性别', trigger: 'blur' }],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' },
					{ validator: checkPhone, trigger: 'blur' }
				]
			}
		};
	},
	methods: {
		//   获取用户列表
		async getUserList() {
			var url = 'user';

			if (this.state.length > 0) {
				if (this.state == 'down') {
					url = url + '/down';
				}
				if (this.state == 'up') {
					url = url + '/up';
				}
			}
			if (this.username.length > 0) {
				url = url + '/username/' + this.username;
			}
			if (this.query.pageSize.length > 0) {
				url = url + '/' + this.query.pageSize;
				if (this.query.id.length > 0) {
					url = url + '/' + this.query.id;
				}
			}

			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				this.userslist = null;
				this.total = null;
				this.page = false;
				return this.$message.error('暂无数据');
			}
			this.userslist = res.data.rows;
			this.total = res.data.total;
			this.pageSize = res.data.pageSize;
			if (this.total / this.pageSize <= this.currentPage) this.down = false;
			if (this.currentPage <= 1) {
				this.up = false;
			}
		},
		clear() {
			this.query.id = '';
			this.state = '';
			this.getUserList();
		},
		//     切换每页显示用户数量
		handleSizeChange(newsize) {
			this.query.pageSize = newsize.toString();
			this.query.id = '';
			this.state = '';

			this.getUserList();
		},
		//     上一页
		pageUp() {
			this.state = 'up';
			this.query.id = this.userslist[0].id;
			this.currentPage -= 1;
			this.down = true;
			this.getUserList();
		},
		//    下一页
		pageDown() {
			this.state = 'down';
			this.query.id = this.userslist[this.userslist.length - 1].id;
			this.currentPage += 1;
			this.up = true;
			this.getUserList();
		},

		//     监听新建用户弹出框关闭时的事件
		addClosed() {
			this.$refs.addref.resetFields();
		},
		//     点击确定按钮后触发
		addUser() {
			this.$refs.addref.validate(async value => {
				if (!value) return true;

				//   进行添加用户
				const { data: res } = await this.axios.post('user', this.addform);
				if (!res.flag) return this.$message.error(res.message);
				this.$message.success('添加用户成功');
				this.addDialogVisible = false;
				this.getUserList();
			});
		},
		//     修改用户方法
		async alterUser(id) {
			this.updateDialogVisible = true;
			const { data: res } = await this.axios.get('user/id/' + id);
			if (!res.flag) return this.$message.error(res.message);
			this.alerlist = res.data;
		},
		//     监听修改用户弹出框关闭时的事件
		updateClosed() {
			this.$refs.uodateref.resetFields();
		},
		//     修改用户信息按钮
		updateUser() {
			this.$refs.uodateref.validate(async value => {
				if (!value) return this.$message.error('请填写正确的格式');
				const { data: res } = await this.axios.put('user', this.alerlist);
				if (!res.flag) return this.$message.error(res.meta.msg);
				this.updateDialogVisible = false;
				this.getUserList();
				this.$message.success('改成用户信息成功');
			});
		},
		//     删除用户操作
		async delectuser(id) {
			const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (res == 'confirm') {
				const { data: res } = await this.axios.delete('user/' + id);
				if (!res.flag) return this.$message.error(res.message);
				this.getUserList();
				this.$message.success('删除成功！！');
			} else {
				this.$message.info('已取消删除');
			}
		},

		//  分配角色按钮
		async updateRoles(row) {
			this.row = row;
			if (row.role == 'user') {
				this.role = false;
			} else {
				this.role = true;
			}

			this.allotJurisdictionCase = true;
		},
		roleChange(role) {
			if (role) {
				this.row.role = 'admin';
			} else {
				this.row.role = 'user';
			}
			this.role = role;
		},
		//  分配角色确定按钮
		async rolesConfirm() {
			if (this.role) {
				const { data: res } = await this.axios.put('user/role', this.row);
				if (!res.flag) return this.$message.error(res.message);
				this.getUserList();
				this.$message.success('权限提升成功！！');
				this.allotJurisdictionCase = false;
			}
		}
	},
	created() {
		this.getUserList();
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
