<template>
	<div class="L0"><div class="welcome">Welcome</div></div>

 </template>

<script>
export default {
	data() {
		return{
			
		}
	},

	created() {
		//防止页面后退
		history.pushState(null, null, document.URL);
		window.addEventListener('popstate', function() {
			history.pushState(null, null, document.URL);
		});
	}
};
</script>

<style scoped>
.L0 {
	font-size: 50px;
}

</style>
