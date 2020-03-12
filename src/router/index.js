import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Admin from "../components/Admin.vue"
import Test from "../components/test.vue"
import Welcome from "../components/children/Welcome.vue"
import User from "../components/children/User.vue"
Vue.use(VueRouter)


const routes = [{
		path: "/login",
		component: Login
	}, {
		path: "/home",
		component: Home
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
			}
		]
	},
	{
		path: "/test",
		component: Test
	}

]

const router = new VueRouter({
	routes
})

export default router
