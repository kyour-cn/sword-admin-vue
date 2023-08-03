<template>
	<sc-table-select
		v-model="state.value"
		:apiObj="state.apiObj"
		:table-width="state.tableWidth"
		clearable
		collapse-tags
		:placeholder="placeholder"
		collapse-tags-tooltip
		:props="state.props"
		@change="onChange"
	>
		<template #header="{form, submit}">
			<el-form :inline="true" :model="form">
				<el-form-item>
					<el-select v-model="form.app_id" placeholder="选择应用" clearable :teleported="false">
						<el-option v-for="item in state.appList" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submit">查询</el-button>
				</el-form-item>
			</el-form>
		</template>
		<el-table-column prop="id" label="ID" width="180"></el-table-column>
		<el-table-column prop="name" label="名称"></el-table-column>
	</sc-table-select>
</template>

<script>
import {reactive} from "vue";
import api from '@/api'

export default {
	name: "roleSelect",
	props: {
		tableWidth: Number,
		placeholder: { type: String, default: "请选择" }
	},
	setup(props, {emit}) {
		const state = reactive({
			apiObj: api.system.role.list,
			tableWidth: props.tableWidth? props.tableWidth : 600,
			props: {
				label: 'name',
				value: 'id',
			},
			value: [],
			appList: [],
			selectedApp: 0
		})

		const getApp =  async () => {
			const res = await api.system.app.list.get({
				pageSize: 50
			});
			state.appList = res.data.data;
			state.selectedApp = res.data.data[0].id;
		}
		getApp();

		const onChange = (data) => {
			emit('onChange', data)
		}

		return { state, onChange}
	}
}
</script>

<style scoped>

</style>
