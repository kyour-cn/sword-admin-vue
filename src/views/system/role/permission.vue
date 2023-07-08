<template>
	<el-dialog
		title="角色权限设置"
		v-model="state.visible"
		:width="500"
		destroy-on-close
		@closed="emit('closed')"
	>
		<div class="treeMain">
			<el-tree
				ref="rule"
				node-key="id"
				show-checkbox
				:data="state.rule.list"
				:default-expand-all="true"
				:default-checked-keys="state.checkids"
				:props="state.rule.props"
			/>
		</div>
		<template #footer>
			<el-button @click="state.visible = false">取 消</el-button>
			<el-button type="primary" :loading="state.isSaveing" @click="submit()">
				保 存
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup>

import {getCurrentInstance, onMounted, reactive, ref} from "vue";

const instance = getCurrentInstance();
const properties = instance.appContext.config.globalProperties;

const emit = defineEmits(["success", "closed", "getNewData"])

const state = reactive({
	checkids: [],
	visible: false,
	isSaveing: false,
	row: {
		id: 0,
		rules_checked: ''
	},
	rule: {
		list: [],
		checked: [],
		props: {
			label: (data) => {
				return data.name
			}
		}
	},
})

const rule = ref(null)

const open = (row) => {
	state.row = row
	state.visible = true;
}

const submit = async () => {
	state.isSaveing = true;
	//选中的和半选的合并后传值接口
	const checkedKeys = rule.value.getCheckedKeys().concat(rule.value.getHalfCheckedKeys());
	const checked = rule.value.getCheckedKeys().join(',')
	let checkIds = checkedKeys.join(',');
	const data = {
		rules: checkIds,
		id: state.row.id,
		rules_checked: checked
	}
	const res = await properties.$API.system.role.edit.post(data);
	if (res.code === 0) {
		state.isSaveing = false;
		state.visible = false;
		properties.$message.success("操作成功")
		emit('success')
		emit('getNewData')
	} else {
		await properties.$alert(res.message, "提示", {type: 'error'})
	}
}

const getRule = async () => {
	const res = await properties.$API.system.rule.list.get();
	if (res.code === 0) {
		state.rule.list = res.data
		state.checkids = state.row.rules_checked.split(',')
	} else {
		await properties.$alert(res.message, "提示", {type: 'error'})
	}
}

onMounted(() => {
	getRule()
})

//暴露给父组件的方法
defineExpose({
	open
})

</script>

<style scoped>
.treeMain {
	height: 280px;
	overflow: auto;
	border: 1px solid #dcdfe6;
	margin-bottom: 10px;
}
</style>
