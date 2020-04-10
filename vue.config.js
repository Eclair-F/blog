module.exports = {
	chainWebpack: config => {
		config.set('externals', {
			vue: 'Vue',
			axios: 'axios',
			nprogress: 'NProgress',
			'tinymce/tinymce': 'tinymce',
			'element-ui': 'element-ui',
		})
	}
}
