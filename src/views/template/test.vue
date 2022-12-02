
<template>
	<el-main>

		<el-card shadow="never" header="角色选择">

			<roleSelect @onChange="change" />

		</el-card>
	</el-main>
</template>

<script>
import roleSelect from "@/components/system/roleSelect";

export default {
	name: 'tableselect',
	components: {
		roleSelect
	},
	data() {
		return {
		}
	},
	methods: {
		//值变化
		change(val){
			this.$message('change事件，返回详情查看控制台')
			console.log(val)
		}
	}
}
</script>

<style scoped>
</style>
