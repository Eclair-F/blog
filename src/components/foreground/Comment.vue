<template>
	<div v-clickoutside="hideReplyBtn" class="my-reply">
		<el-avatar class="header-img" :size="40" :src="avatar"></el-avatar>
		<div class="reply-info"><el-input type="textarea" v-model="comment" :placeholder="placeholder" maxlength="50" show-word-limit :disabled="!input"></el-input></div>
		<div class=" reply-btn-box"><el-button class="reply-btn" type="success" @click="sendComment" plain round v-reClick>评论</el-button></div>
		<div v-if="show">
			<div v-for="(item, i) in comments" :key="i" class="author-title reply-father">
				<el-avatar class="header-img" :size="40" :src="item.avatar"></el-avatar>
				<div class="author-info">
					<span class="author-name">{{ item.nickname }}</span>
					<span class="author-time">{{ item.date }}</span>
				</div>
				<div class="icon-btn">
					<span @click="deleteComment(item.id, i)" v-show="deleteShow(item.userId)"><i class="el-icon-delete">删除</i></span>
					<span @click="showReplyInput(i, item.nickname, item.userId)"><i class="el-icon-s-comment" v-text="num(item)"></i></span>
					<span v-if="!item.replyShow" @click="showReply(item)"><i class="el-icon-caret-top">查看回复</i></span>
					<span v-else @click="showReply(item)"><i class="el-icon-caret-bottom">关闭</i></span>
				</div>
				<div class="talk-box">
					<p>
						<span class="reply">{{ item.content }}</span>
					</p>
				</div>
				<div class="reply-box" v-show="item.replyShow">
					<div v-for="(reply, j) in item.replies" :key="j" class="author-title">
						<el-avatar class="header-img" :size="40" :src="reply.avatar"></el-avatar>
						<div class="author-info">
							<span class="author-name">{{ reply.from }}</span>
							<span class="author-time">{{ reply.date }}</span>
						</div>
						<div class="icon-btn">
							<span @click="deleteReply(item.id, reply.id, i, j)" v-show="deleteShow(reply.fromId)"><i class="el-icon-delete">删除</i></span>
							<span @click="showReplyInput(i, reply.from, reply.fromId)"><i class="el-icon-s-comment">回复</i></span>
						</div>
						<div class="talk-box">
							<p>
								<span>回复 {{ reply.to }}:</span>
								<span class="reply">{{ reply.content }}</span>
							</p>
						</div>
						<div class="reply-box"></div>
					</div>
				</div>
				<div v-if="input" v-show="_inputShow(i)" class="my-reply my-comment-reply">
					<el-avatar class="header-img" :size="40" :src="avatar"></el-avatar>
					<div class="reply-info"><el-input type="textarea" v-model="replyComment" placeholder="请输入内容" maxlength="50" show-word-limit></el-input></div>
					<div class=" reply-btn-box"><el-button class="reply-btn" size="medium" @click="sendCommentReply(i)" type="primary" v-reClick>发表回复</el-button></div>
				</div>
			</div>
		</div>
		<div v-if="!show">暂无</div>
	</div>
</template>
<script>
const clickoutside = {
	// 初始化指令
	bind(el, binding) {
		function documentHandler(e) {
			// 这里判断点击的元素是否是本身，是本身，则返回
			if (el.contains(e.target)) {
				return false;
			}
			// 判断指令中是否绑定了函数
			if (binding.expression) {
				// 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
				binding.value(e);
			}
		}
		// 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
		el.vueClickOutside = documentHandler;
		document.addEventListener('click', documentHandler);
	},
	unbind(el) {
		// 解除事件监听
		document.removeEventListener('click', el.vueClickOutside);
		delete el.vueClickOutside;
	}
};
export default {
	name: 'ArticleComment',
	props: ['id'],
	data() {
		return {
			cnum: 0,
			placeholder: '',
			input: false,
			show: true,
			btnShow: false,
			index: '0',
			comment: '',
			replyComment: '',
			nickname: '',
			avatar: '',
			userId: '',
			to: '',
			toId: '',
			comments: []
		};
	},
	directives: { clickoutside },
	created() {
		this.getUser();
		this.getComment();
	},
	methods: {
		//   获取用户信息
		async getUser() {
			if (sessionStorage.getItem('id') != null && sessionStorage.getItem('nickname') != null && sessionStorage.getItem('avatar') != null) {
				this.placeholder = '请输入内容';
				this.nickname = sessionStorage.getItem('nickname');
				this.avatar = sessionStorage.getItem('avatar');
				this.userId = sessionStorage.getItem('id');
				this.input = true;
			} else {
				this.placeholder = '请登陆';
			}
		},
		//   获取评论
		async getComment() {
			let url = 'comment/';
			if (this.id != null && this.id.length > 0) {
				url = url + this.id;
			} else {
				url = url + 'message';
			}
			const { data: res } = await this.axios.get(url);
			if (!res.flag) {
				this.show = false;
				return;
			}
			this.cnum = res.data.total;
			this.comments = res.data.rows;
		},
		inputFocus() {
			var replyInput = document.getElementById('replyInput');
			replyInput.focus();
		},
		showReplyBtn() {
			this.btnShow = true;
		},
		showReply(item) {
			item.replyShow = !item.replyShow;
		},
		hideReplyBtn() {
			this.btnShow = false;
		},
		showReplyInput(i, name, id) {
			this.comments[this.index].inputShow = false;
			this.index = i;
			this.comments[i].inputShow = true;
			this.to = name;
			this.toId = id;
		},
		_inputShow(i) {
			return this.comments[i].inputShow;
		},
		num(item) {
			if (item.replies == null) {
				return 0;
			} else {
				return item.replies.length;
			}
		},
		async sendComment() {
			if (!this.comment) {
				this.$message({
					showClose: true,
					type: 'warning',
					message: '不能为空'
				});
			} else {
				let timeNow = new Date().getTime();
				let time = this.dateStr(timeNow);
				let comment = {
					blogId: this.id,
					content: this.comment,
					userId: window.sessionStorage.getItem('id'),
					nickname: this.nickname,
					avatar: this.avatar,
					date: time
				};
				const { data: res } = await this.axios.post('comment', comment);
				if (!res.flag) return this.$message.error(res.message);
				this.$message.success('评论成功');
				this.comments.unshift(comment);
				this.comment = '';
				this.show = true;
				if (comment.blogId != null && comment.blogId.length > 0) {
					this.numComment();
				}
			}
		},
		async numComment() {
			this.cnum = this.cnum + 1;

			var info = {
				id: this.id,
				commentNum: this.cnum
			};

			await this.axios.put('blog/information', info);
		},
		async sendCommentReply(i) {
			if (!this.replyComment) {
				this.$message({
					showClose: true,
					type: 'warning',
					message: '回复不能为空'
				});
			} else {
				let timeNow = new Date().getTime();
				let time = this.dateStr(timeNow);
				let a = {
					from: this.nickname,
					fromId: this.userId,
					to: this.to,
					toId: this.toId,
					avatar: this.avatar,
					content: this.replyComment,
					date: time
				};
				let comment = {
					id: this.comments[i].id,
					replies: [a]
				};
				const { data: res } = await this.axios.put('comment', comment);
				if (!res.flag) return this.$message.error(res.message);
				this.$message.success('成功');
				if (this.comments[i].replies == null) {
					this.comments[i].replies = [a];
				} else {
					this.comments[i].replies.unshift(a);
				}
				this.replyComment = '';
			}
		},
		deleteShow(id) {
			if (id == this.userId || sessionStorage.getItem('role') == 'admin') {
				return true;
			} else {
				return false;
			}
		},
		async deleteComment(id, i) {
			let comment = {
				id: id,
				userId: this.userId
			};
			const { data: res } = await this.axios.delete('comment', { data: comment });
			if (!res.flag) return this.$message.error(res.message);
			this.comments.splice(i, 1);
			this.$message.success('成功');
			this.dnum();
		},
		async dnum() {
			this.cnum = this.cnum - 1;
			var info = {
				id: this.id,
				commentNum: this.cnum
			};
			await this.axios.put('blog/information', info);
		},
		async deleteReply(id, replyId, i, j) {
			let comment = {
				id: id,
				userId: this.userId,
				replyId: replyId
			};
			const { data: res } = await this.axios.delete('comment/reply', { data: comment });
			if (!res.flag) return this.$message.error(res.message);
			this.comments[i].replies.splice(j, 1);
			this.$message.success('成功');
		},
		dateStr(date) {
			//获取js 时间戳
			var time = new Date().getTime();
			//去掉 js 时间戳后三位，与php 时间戳保持一致
			time = parseInt((time - date) / 1000);
			//存储转换值
			var s;
			if (time < 60 * 10) {
				//十分钟内
				return '刚刚';
			} else if (time < 60 * 60 && time >= 60 * 10) {
				//超过十分钟少于1小时
				s = Math.floor(time / 60);
				return s + '分钟前';
			} else if (time < 60 * 60 * 24 && time >= 60 * 60) {
				//超过1小时少于24小时
				s = Math.floor(time / 60 / 60);
				return s + '小时前';
			} else if (time < 60 * 60 * 24 * 30 && time >= 60 * 60 * 24) {
				//超过1天少于30天内
				s = Math.floor(time / 60 / 60 / 24);
				return s + '天前';
			} else {
				//超过30天ddd
				let date = new Date(parseInt(date));
				return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			}
		}
	}
};
</script>
<style lang="stylus" scoped>
.my-reply
	padding 10px
	background-color #fffbee
	.header-img
		display inline-block
		vertical-align top
	.reply-info
		display inline-block
		margin-left 5px
		width 90%
		@media screen and (max-width: 1200px)
			width 80%
		.reply-input
			min-height 20px
			line-height 22px
			padding 10px 10px
			color #ccc
			background-color #fff
			border-radius 5px
			&:empty:before
				content attr(placeholder)
			&:focus:before
				content none
			&:focus
				padding 8px 8px
				border 2px solid blue
				box-shadow none
				outline none
	.reply-btn-box
		height 25px
		margin 10px 0
		.reply-btn
			position relative
			float right
			margin-right 15px
.my-comment-reply
	margin-left 50px
	.reply-input
		width flex
.author-title:not(:last-child)
	border-bottom 1px solid rgba(178, 186, 194, 0.3)
.author-title
	padding 10px
	.header-img
		display inline-block
		vertical-align top
	.author-info
		display inline-block
		margin-left 5px
		width 60%
		height 40px
		line-height 20px
		>span
			display block
			cursor pointer
			overflow hidden
			white-space nowrap
			text-overflow ellipsis
		.author-name
			color #000
			font-size 18px
			font-weight bold
		.author-time
			font-size 14px
	.icon-btn
		width 40%
		padding 0 !important
		float right
		@media screen and (max-width: 1200px)
			width 20%
			padding 7px
		>span
			cursor pointer
		.iconfont
			margin 0 5px
	.talk-box
		margin 0 50px
		>p
			margin 0
		.reply
			font-size 16px
			color #000
	.reply-box
		margin 10px 0 0 50px
		background-color #efefef
</style>
