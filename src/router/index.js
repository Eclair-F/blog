import Vue from "vue"
import VueRouter from "vue-router"
const Login = () => import("../components/Login.vue")
const Home = () => import("../components/Home.vue")
const Admin = () => import("../components/Admin.vue")
const Welcome = () => import("../components/background/Welcome.vue")
const User = () => import("../components/background/User.vue")
const Blog = () => import("../components/background/Blog.vue")
const AdminList = () => import("../components/background/Admin.vue")
const Editor = () => import("../components/background/Editor.vue")
const Draft = () => import("../components/background/Draft.vue")
const HomePage = () => import("../components/foreground/Home.vue")
const Article = () => import("../components/foreground/Article.vue")
const Register = () => import("../components/foreground/Register.vue")
const UserInfo = () => import("../components/foreground/UserInfo.vue")
const Essays = () => import("../components/foreground/Essays.vue")
const Essay = () => import("../components/background/Essay.vue")
const EssayList = () => import("../components/background/Essays.vue")
const Comment = () => import("../components/foreground/Comment.vue")
Vue.use(VueRouter)


const routes = [{
		path: "/login",
		component: Login
	}, {
		path: "/Home",
		component: Home,
		redirect: "/home",
		children: [{
				path: "/home",
				component: HomePage
			},
			{
				path: "/article/:id",
				component: Article
			},
			{
				path: "/category/:category",
				component: HomePage,

			},
			{
				path: "/register",
				component: Register,
			},

			{
				path: "/userinfo",
				component: UserInfo,
			},

			{
				path: "/message",
				component: Comment,
			},

			{
				path: '/editors',
				component: Editor
			},
			{
				path: '/essays',
				component: Essays
			},
			{
				path: '/essay',
				component: Essay
			},
			{
				path: '/search/:search',
				component: HomePage
			},

		]
	},
	{
		path: "/admin",
		component: Admin,
		redirect: "/welcome",
		children: [{
				path: "/welcome",
				component: Welcome
			},
			{
				path: '/user',
				component: User
			},
			{
				path: '/blog',
				component: Blog,
			},
			{
				path: '/draft',
				component: Draft,
			},
			{
				path: "/admins",
				component: AdminList
			},
			{
				path: '/update/:id',
				component: Editor
			},
			{
				path: '/editor',
				component: Editor
			},
			{
				path: '/essayList',
				component: EssayList
			}
		]
	},


]

const router = new VueRouter({
	routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/') {
		return next('/home')
	}
	next()
})

export default router
