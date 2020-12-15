<template>
	<div>
		<div>
			<el-row>
				<el-col :span="4"><img :src="user.avatar" class="avatar" /></el-col>
				<el-col class="userinfo">
					<el-form label-width="80px" :model="user">
						<el-form-item label="用户名" prop="">{{ user.username }}</el-form-item>
						<el-form-item label="昵称" prop="">{{ user.nickname }}</el-form-item>
						<el-form-item label="性别" prop="">{{ user.sex }}</el-form-item>
						<el-form-item label="邮箱" prop="">{{ user.email }}</el-form-item>
						<el-form-item label="手机" prop="">{{ user.mobile }}</el-form-item>
						<el-form-item label="注册时间" prop="">{{ user.date }}</el-form-item>
						
					</el-form>
				</el-col>
			</el-row>
			<el-button class="button" type="info" @click="avatarVisible" plain round>修改头像</el-button>
			<el-button class="button" type="primary" @click="updateVisible" plain round>修改信息</el-button>
			<el-button class="button" type="primary" @click="updateEmailVisible" plain round>更换邮箱</el-button>
			<el-button class="button" type="danger" @click="passVisible" plain round>修改密码</el-button>
		</div>

		<!-- 弹出的修改用户信息的对话框 -->
		<el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" @close="updateClosed" width="40%">
			<el-form label-width="80px" :model="user" :rules="formRule" ref="updateref">
				<el-form-item label="昵称" prop="nickname"><el-input v-model="user.nickname"></el-input></el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="user.sex">
						<el-radio-button label="男"></el-radio-button>
						<el-radio-button label="女"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="mobile"><el-input v-model="user.mobile"></el-input></el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="updateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateUser" v-reClick>确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出的更换邮箱的对话框 -->
		<el-dialog title="更换邮箱" :visible.sync="updateEmailDialogVisible" @close="updateEmailClosed" width="40%">
			<el-form label-width="100px" :model="updateOldEmail" :rules="formRule" ref="updateref">
				<el-form-item label="输入旧邮箱" prop="oldEmail"><el-input v-model="updateOldEmail.oldEmail" maxlength="32"></el-input></el-form-item>

				<el-form-item label="新邮箱" prop="email"><el-input v-model="updateOldEmail.email" maxlength="32"></el-input></el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="updateEmailDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateMail" v-reClick>确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出的修改用户密码的对话框 -->
		<el-dialog title="修改密码" :visible.sync="passDialogVisible" @close="passClosed" width="40%">
			<el-form label-width="100px" :model="updateOldPass" :rules="formRule" ref="passref">
				<el-form-item label="输入旧密码" prop="oldpass"><el-input v-model="updateOldPass.oldpass" type="password"></el-input></el-form-item>
				<el-form-item label="输入新密码" prop="password"><el-input v-model="updateOldPass.password" type="password"></el-input></el-form-item>
				<el-form-item label="确认新密码" prop="checkPass"><el-input v-model="updateOldPass.checkPass" type="password"></el-input></el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="passDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updatePassword" v-reClick>确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹出的修改用户头像的对话框 -->
		<my-upload :key="avatarid" @crop-success="cropSuccess" v-model="avatarDialogVisible" :width="100" :height="100" :size="size"></my-upload>
	</div>
</template>
<script>
import myUpload from 'vue-image-crop-upload';
export default {
	components: {
		'my-upload': myUpload
	},
	data() {
		//   验证旧密码
		const checkOldPass = async (rule, value, cb) => {
			this.updatePass.id = this.user.id;
			this.updatePass.password = this.updateOldPass.oldpass;
			const { data: res } = await this.axios.post('/user/oldPassword', this.updatePass);
			if (res.flag) {
				return cb();
			}
			return cb(new Error('旧密码错误'));
		};
		//确认密码
		const checkPass = (rule, value, cb) => {
			if (value == '') {
				cb(new Error('请再次输入密码'));
			} else if (value != this.updateOldPass.password) {
				cb(new Error('两次输入密码不一致!'));
			} else {
				cb();
			}
		};
		//   验证邮箱的规则
		const checkOldEmail = async (rule, value, cb) => {
			const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (regEmail.test(value)) {
				this.updateEmail.id = this.user.id;
				this.updateEmail.email = this.updateOldEmail.oldEmail;
				const { data: res } = await this.axios.post('/user/oldEmail', this.updateEmail);
				if (res.flag) {
					return cb();
				} else {
					return cb(new Error('请输入原来的邮箱'));
				}
			}
			return cb(new Error('请输入正确的邮箱'));
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
			size: 2.1,
			avatarid: 0,
			// 修改用户信息的显示与隐藏
			updateDialogVisible: false,
			// 修改用户密码的显示与隐藏
			passDialogVisible: false,
			avatarDialogVisible: false,
			updateEmailDialogVisible: false,
			user: {
				id: '',
				username: '',
				nickname: '',
				sex: '',
				avatar: '',
				email: '',
				mobile: ''
			},

			// 修改用户密码的表单数据
			updateOldPass: {
				id: '',
				oldpass: '',
				password: '',
				checkPass: ''
			},
			// 修改用户密码的表单数据
			updatePass: {
				id: '',
				password: ''
			},
			// 修改用户的头像
			updateAvatar: {
				id: '',
				avatar: ''
			},
			// 修改用户的邮箱
			updateOldEmail: {
				id: '',
				oldEmail: '',
				email: ''
			},
			// 修改用户的邮箱
			updateEmail: {
				id: '',
				email: ''
			},

			// 添加用户表单数据的验证规则
			formRule: {
				nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				oldpass: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkOldPass, trigger: 'blur' }
				],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				checkPass: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
					{ validator: checkPass, trigger: 'change' }
				],
				oldEmail: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' },
					{ validator: checkOldEmail, trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ min: 3, max: 32, message: '长度在 3 到 32个字符', trigger: 'blur' },
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
		//   获取用户信息
		async getUser() {
			var url = 'user/id/' + sessionStorage.getItem('id');
			const { data: res } = await this.axios.get(url);
			if (!res.flag) return;
			localStorage.setItem('data', JSON.stringify(res.data));
			this.user = res.data;
		},
		//     显示修改用户信息方法
		updateVisible() {
			this.updateDialogVisible = true;
		},
		//     监听修改用户信息弹出框关闭时的事件
		updateClosed() {
			this.$refs.updateref.resetFields();
		},
		//     修改用户信息按钮
		updateUser() {
			this.$refs.updateref.validate(async value => {
				if (!value) return this.$message.error('请填写正确的格式');
				const { data: res } = await this.axios.put('user', this.user);
				if (!res.flag) return this.$message.error(res.meta.msg);
				this.updateDialogVisible = false;
				this.getUser();
				this.$message.success('改成用户信息成功');
			});
		},
		//     显示修改用户信息方法
		updateEmailVisible() {
			this.updateEmailDialogVisible = true;
		},
		//     监听修改用户邮箱弹出框关闭时的事件
		updateEmailClosed() {
			this.$refs.updateref.resetFields();
		},
		//     修改用户邮箱按钮
		updateMail() {
			this.$refs.updateref.validate(async value => {
				if (!value) return this.$message.error('请填写正确的格式');
				this.updateEmail.id = this.user.id;
				this.updateEmail.email = this.updateOldEmail.email;
				const { data: res } = await this.axios.put('user/email', this.updateEmail);
				if (!res.flag) return this.$message.error(res.meta.msg);
				this.updateEmailDialogVisible = false;
				this.getUser();
				this.$message.success('修改邮箱成功，请激活');
			});
		},
		//     显示修改用户密码方法
		passVisible() {
			this.passDialogVisible = true;
		},
		//     监听修改用户密码弹出框关闭时的事件
		passClosed() {
			this.$refs.passref.resetFields();
		},
		//     修改用户密码按钮
		updatePassword() {
			this.$refs.passref.validate(async value => {
				if (!value) return this.$message.error('请填写正确的格式');
				this.updatePass.id = this.user.id;
				this.updatePass.password = this.updateOldPass.password;
				const { data: res } = await this.axios.put('user/password', this.updatePass);
				if (!res.flag) return this.$message.error(res.message);
				this.passDialogVisible = false;
				this.$message.success('密码修改成功');
				sessionStorage.clear();
				localStorage.clear();
				this.$router.push('/login');
			});
		},
		//     显示修改用户头像方法
		avatarVisible() {
			this.avatarDialogVisible = true;
		},

		async cropSuccess(imgDataUrl) {
			this.updateAvatar.avatar = imgDataUrl;
			this.avatarDialogVisible = false;
			this.avatarid = Math.random();
			this.updateAvatar.id = this.user.id;
			const { data: res } = await this.axios.put('user/avatar', this.updateAvatar);
			if (!res.flag) return this.$message.error(res.message);
			this.$message.success('修改成功');
			var data = JSON.parse(localStorage.getItem('data'));
			data.avatar = imgDataUrl;
			this.user.avatar = imgDataUrl;
			localStorage.setItem('data', JSON.stringify(data));
			this.resetSetItem('avatar', imgDataUrl);
		}
	},
	created() {
		if (sessionStorage.getItem('token') == null || sessionStorage.getItem('id') == null) {
			this.$router.push('/login');
		}
		this.getUser();
	}
};
</script>
<style lang="less" scoped>
.userinfo {
	margin-top: 30px;
	margin-left: 250px;
	width: 30%;
}
.button {
	margin: 30px;
}
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
	margin-top: 40px;
	margin-left: 150px;
}
.upload {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
