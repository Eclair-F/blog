<template>
	<div class="register">
		<el-form label-width="80px" :rules="addformRule" :model="addform" ref="addref">
			<el-form-item label="用户名" prop="username"><el-input v-model="addform.username" maxlength="15"></el-input></el-form-item>
			<el-form-item label="昵称" prop="nickname"><el-input v-model="addform.nickname" maxlength="15"></el-input></el-form-item>
			<el-form-item label="密码" prop="password"><el-input v-model="addform.password" type="password" maxlength="15"></el-input></el-form-item>
			<el-form-item label="确认密码" prop="checkPass"><el-input v-model="addform.checkPass" type="password" maxlength="15"></el-input></el-form-item>
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
			<router-link to="/home"><el-button class="button" @click="returnHome">取 消</el-button></router-link>
			<el-button type="primary" @click="addUser" class="button" v-reClick>确 定</el-button>
		</span>
	</div>
</template>

<script>
export default {
	props: ['out'],
	data() {
		//   验证用户名
		const checkUsername = async (rule, value, cb) => {
			var url = '/user/exist/' + value;
			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				return cb();
			}
			return cb(new Error('用户名已被使用'));
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
		//   验证邮箱的规则
		const checkEmail = (rule, value, cb) => {
			const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (regEmail.test(value)) {
				return cb();
			}
			return cb(new Error('请输入正确的邮箱'));
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
			addform: {
				username: '',
				password: '',
				checkPass: '',
				role: 'user',
				sex: '',
				email: '',
				mobile: ''
			},
			addformRule: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkUsername, trigger: 'blur' }
				],
				nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				checkPass: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkPass, trigger: 'change' }
				],
				sex: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ min: 3, max: 32, message: '长度在 3 到 32  个字符', trigger: 'blur' },
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
		//     点击确定按钮后触发
		addUser() {
			this.$refs.addref.validate(async value => {
				if (!value) return true;
				//   进行添加用户
				const { data: res } = await this.axios.post('user', this.addform);
				if (!res.flag) return this.$message.error(res.message);
				this.$message.success('注册成功,请在三小时内验证邮箱');
				this.$router.push('/login');
			});
		},
		returnHome() {
			this.$router.push('/home');
		}
	},
	created() {}
};
</script>

<style scoped>
.register {
	margin: 50px 300px 0px 300px;
	width: 40%;
}
.button {
	margin: 30px;
}
</style>
