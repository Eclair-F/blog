<template>
	<div class="login_box">
		<div class="box">
			<!-- 头像区域 -->
			<div class="userheade" @click="toHome"><img src="../assets/logo.png" alt="" /></div>
			<!-- 表单区域 -->
			<el-form label-width="0px" class="forms" :model="form" :rules="ruless" ref="loginRef">
				<el-form-item prop="username"><el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="form.username"></el-input></el-form-item>
				<el-form-item prop="password">
					<el-input placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
				</el-form-item>
				<el-form-item class="buttons">
					<router-link to="/register"><el-button class="button" type="success">注册</el-button></router-link>
					<el-button type="primary" @click="login" v-reClick>登陆</el-button>
					<el-button type="info" @click="resets">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			fromPath: '',
			loginNum: 0,
			form: {
				username: '',
				password: ''
			},
			ruless: {
				username: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }]
			}
		};
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.fromPath = from.path;
		});
	},
	methods: {
		toHome() {
			{
				this.$router.push('/home');
			}
		},
		resets() {
			this.$refs.loginRef.resetFields();
		},
		login() {
			this.$refs.loginRef.validate(async boolean => {
				if (!boolean) return;			
				const { data: res } = await this.axios.post('/user/login', this.form);
				if (!res.flag) {
					this.loginNum += 1;
					if (this.loginNum > 3) {
						return this.$message.error('服务器内部错误！请重试');
					}
					return this.$message.error('您登陆的密码或用户名错误！请重试');
				}
				//   message身上有两个方法error是错误的弹窗方式，message是正确之后的弹窗
				this.$message.success('恭喜您登陆成功');

				//   在登录成功之后应该把服务器返回的token值保存到客户端的sessionStorage中，这个生命周期为关闭页面就消失
				//   在之后的操作中必须有这个token才属于登陆成功
				sessionStorage.setItem('token', res.data.token);
				sessionStorage.setItem('role', res.data.role);
				sessionStorage.setItem('id', res.data.id);
				sessionStorage.setItem('nickname', res.data.nickname);
				sessionStorage.setItem('avatar', res.data.avatar);
				//   在登录成功之后应该把服务器返回的token值保存到客户端的cookies中
				var date = new Date();
				date.setDate(date.getDate() + 3);
				localStorage.setItem('date', date.getTime());
				localStorage.setItem('data', JSON.stringify(res.data));
				localStorage.setItem('token', res.data.token);
				// //   通过编程式的导航跳转页面
				if (this.fromPath.indexOf('register') > 0) {
					this.$router.push('/home');
				} else {
					this.$router.go(-1);
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.login_box {
	background-color: #254969;
	width: 100%;
	height: 100%;
}
.box {
	width: 450px;
	height: 300px;
	background-color: #fff;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	.buttons {
		text-align: right;
		.button {
			float: left;
		}
	}

	.forms {
		position: absolute;
		top: 100px;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
}
.userheade {
	width: 100px;
	height: 100px;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	background-color: #ebede9;
	overflow: hidden;
	border: 6px solid #fff;
	box-shadow: 0 0 3px 3px #ebede9;
}
.userheade img {
	width: 100%;
	height: 100%;
}
</style>
