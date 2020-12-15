<template>
	<div>
		<el-breadcrumb v-show="home" separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
			<el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-if="draft" :to="{ path: '/blog' }">博客列表</el-breadcrumb-item>
			<el-breadcrumb-item v-else :to="{ path: '/draft' }">草稿列表</el-breadcrumb-item>
			<el-breadcrumb-item v-show="show">修改</el-breadcrumb-item>
			<el-breadcrumb-item v-show="!show">添加</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm el-scrollbar__wrap">
			<el-form-item label="题目" prop="title"><el-input v-model="ruleForm.title"></el-input></el-form-item>
			<el-form-item label="类别" prop="category">
				<el-select v-model="ruleForm.category" placeholder="请选择类别">
					<el-option label="韶华追忆" value="韶华追忆"></el-option>
					<el-option label="技术分享" value="技术分享"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="封面" prop="cover">
				<img class="cover" :src="ruleForm.cover" />
				<el-button class="button" type="info" @click="coverVisible" plain round>上传封面</el-button>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<div class="tinymce-editor"><editor v-model="ruleForm.content" :init="init" :disabled="disabled"></editor></div>
			</el-form-item>
			<el-form-item>
				<el-button v-if="draft" type="primary" @click="addDraft('ruleForm')" v-reClick>存为草稿</el-button>
				<el-button v-if="blog" type="primary" @click="addBlog('ruleForm')" v-reClick>立即发布</el-button>
				<el-button v-if="neither" type="primary" @click="updateBlog('ruleForm')" v-reClick>确认修改</el-button>

				<el-button @click="resetForm('ruleForm')" v-reClick>重置</el-button>
			</el-form-item>
		</el-form>
		<my-upload :key="coverid" @crop-success="cropSuccess" v-model="coverDialogVisible" :width="230" :height="150" :size="size" noCircle noSquare></my-upload>
	</div>
	<!-- 富文本区域 -->
</template>

<script>
import myUpload from 'vue-image-crop-upload';
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
// import 'tinymce/themes/silver';
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
// import 'tinymce/plugins/image'; // 插入上传图片插件
// import 'tinymce/plugins/media'; // 插入视频插件
// import 'tinymce/plugins/table'; // 插入表格插件
// import 'tinymce/plugins/lists'; // 列表插件
// import 'tinymce/plugins/wordcount'; // 字数统计插件
// import 'tinymce/plugins/autoresize';
export default {
	components: {
		Editor,
		'my-upload': myUpload
	},
	props: {
		// 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
		// 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
		baseUrl: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		plugins: {
			type: [String, Array],
			default: 'lists image media table wordcount autoresize'
		},
		toolbar: {
			type: [String, Array],
			default:
				'undo redo |  formatselect | fontsizeselect | fontselect | bold italic forecolor backcolor  outdent indent|  alignleft aligncenter alignright alignjustify | bullist numlist | lists image media table | removeformat '
		}
	},
	data() {
		return {
			init: {
				//language_url: '${this.baseUrl}/tinymce/langs/zh_CN.js',
				//language: 'zh_CN',
				// skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
				// content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
				//	skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
				//	content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
				height: 450,
				plugins: this.plugins,
				toolbar: this.toolbar,
				branding: false,
				menubar: false,
				indentation : '2em',
				fontsize_formats: '10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 36pt',
				//image_prepend_url: "data:image/jpeg;base64,",
				//image_dimensions: false,
				// 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
				// 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
				images_upload_handler: (blobInfo, success, failure) => {
					let strLength = blobInfo.base64().length;
					let fileLength = parseInt(strLength - (strLength / 8) * 2);
					// 由字节转换为KB
					let size = (fileLength / 1024).toFixed(2);

					if (size > 1024) {
						return failure('图片太大，超过1M');
					}
					const image = 'data:image/jpeg;base64,' + blobInfo.base64();
					// 创建新的图片对象
					let img = new Image();
					// 指定图片的DataURL(图片的base64编码数据)
					img.src = image;
					if (img.naturalWidth == 0) {
						return failure('上传失败');
					}
					// 创建Canvas对象(画布)
					let canvas = document.createElement('canvas');
					// 获取对应的CanvasRenderingContext2D对象(画笔)
					let context = canvas.getContext('2d');
					//画布宽度
					let width;
					if (img.naturalWidth > 512) {
						width = 512;
					} else {
						width = img.naturalWidth;
					}
					// 监听浏览器加载图片完成，然后进行绘制
					img.onload = () => {
						//画布大小按照图片的比例生成
						let height = width / (img.naturalWidth / img.naturalHeight);
						// 指定canvas画布大小，该大小为最后生成图片的大小
						canvas.width = width;
						canvas.height = height;
						/* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点， canvas.width, canvas.height 是将图片按给定的像素进行缩小。*/
						/* 如果不指定缩小的像素，图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后得到的图片就是张局部图。图片小于画布就会有黑边。*/
						context.drawImage(img, 0, 0, canvas.width, canvas.height);
						// 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
						let ima = canvas.toDataURL('image/jpeg', 0.7);
						if (ima.length > 0) {
							return success(ima);
						} else {
							return failure('上传失败');
						}
					};
				}
			},

			id: this.$route.params.id,
			blog: true,
			draft: true,
			neither: false,
			coverDialogVisible: false,
			coverid: 0,
			size: 2.1,
			ruleForm: {
				id: '',
				title: '',
				category: '',
				content: '',
				cover: ''
			},
			rules: {
				name: [{ required: true, message: '请输入题目', trigger: 'blur' }],
				category: [{ required: true, message: '请选择类别', trigger: 'change' }],
				content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
				cover: [{ required: true, message: '请上传封面', trigger: 'blur' }]
			},

			fromPath: '',
			show: false,
			home: true
		};
	},

	mounted() {
		tinymce.init({});
	},
	methods: {
		async getBlog(id) {
			if (id.length > 0) {
				const { data: res } = await this.axios.get('blog/id/' + id);
				if (!res.flag) return this.$message.error(res.message);
				this.ruleForm = res.data;
				if (res.data.id != 0) {
					if (res.data.draft == 'true') {
						this.draft = false;
					} else {
						this.blog = false;
					}
					if (this.draft ^ this.blog) {
						this.neither = true;
					}
				}
			}
		},

		addDraft(formName) {
			this.$refs[formName].validate(async valid => {
				if (!valid) return true;
				if (this.ruleForm.id != null && this.ruleForm.id.length > 0) {
					const { data: res } = await this.axios.put('blog', this.ruleForm);
					if (!res.flag) return this.$message.error(res.message);
					const { data: resp } = await this.axios.put('blog/' + this.ruleForm.id);
					if (!resp.flag) return this.$message.error(res.message);
				} else {
					const { data: res } = await this.axios.post('draft', this.ruleForm);
					if (!res.flag) return this.$message.error(res.message);
					this.$message.success('添加成功');
				}

				this.$router.go(-1);
			});
		},

		addBlog(formName) {
			this.$refs[formName].validate(async valid => {
				if (!valid) return true;

				if (this.ruleForm.id != null && this.ruleForm.id.length > 0) {
					const { data: res } = await this.axios.put('blog', this.ruleForm);
					if (!res.flag) return this.$message.error(res.message);
					const { data: resp } = await this.axios.put('draft/' + this.ruleForm.id);
					if (!resp.flag) return this.$message.error(res.message);
				} else {
					const { data: res } = await this.axios.post('blog', this.ruleForm);
					if (!res.flag) return this.$message.error(res.message);
					this.$message.success('发布成功');
				}
				this.$router.go(-1);
			});
		},
		updateBlog(formName) {
			this.$refs[formName].validate(async valid => {
				if (!valid) return true;
				const { data: res } = await this.axios.put('blog', this.ruleForm);
				if (!res.flag) return this.$message.error(res.message);
				this.$message.success('修改成功');
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			if (this.ruleForm.id != null) {
				this.getBlog(this.ruleForm.id);
			}
		},
		//     显示上传封面方法
		coverVisible() {
			this.coverDialogVisible = true;
		},
		// 压缩图片
		compress(img, size) {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			//	let initSize = img.src.length;
			let width = img.width;
			let height = img.height;
			canvas.width = width;
			canvas.height = height;
			// 铺底色
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, width, height);
			//进行最小压缩
			let ndata = canvas.toDataURL('image/jpeg', size);
			return ndata;
		},
		async cropSuccess(imgDataUrl) {
			let img = new Image();
			img.src = imgDataUrl;
			//var data = this.compress(img, 0.7);
			this.ruleForm.cover = imgDataUrl;
			this.coverDialogVisible = false;
			this.coverid = Math.random();
			this.$message.success('上传成功');
		}
	},
	created() {
		if (this.$route.params.id != null) {
			this.show = true;
			this.getBlog(this.$route.params.id);
		}
	}
};
</script>
<style scoped>
.button {
	vertical-align: bottom;
}
.cover {
	float: left;
}
</style>
