<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"/>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="!state.selection.length"
									 @click="batchDel"/>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="state.search.keyword" placeholder="角色名称" clearable @clear="clearSearch"/>
					<el-button type="primary" icon="el-icon-search" @click="upSearch"/>
				</div>
			</div>
		</el-header>
		<el-header style="height: auto;">
			<sc-select-filter
				:data="state.filterData"
				:selected-values="state.selectedApp"
				:label-width="80"
				@on-change="filterChange"
			/>
		</el-header>
		<el-main class="nopadding">
			<sc-table ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="name" width="150"></el-table-column>
				<el-table-column label="排序" prop="sort" width="80"></el-table-column>
				<el-table-column label="状态" prop="status" width="60">
					<template #default="scope">
						<sc-status-indicator
							:pulse="!!scope.row.status"
							:type="scope.row.status? 'success': 'danger'"
						/>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="create_time" width="170">
					<template #default="{row,$index}">
						{{ $TOOL.dateFormat(row.create_time * 1000) }}
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="300">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="tableEdit(scope.row)">
								编辑
							</el-button>
							<el-button text type="primary" size="small" @click="openPermission(scope.row)">
								权限设置
							</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="tableDel(scope.row)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>
			</sc-table>
		</el-main>
	</el-container>

	<save-dialog
		v-if="dialog.save"
		ref="saveDialogRef"
		@success="handleSaveSuccess"
		@closed="dialog.save=false"
	/>

	<permission-dialog
		v-if="dialog.permission"
		ref="permissionDialogRef"
		:app-id="state.selectedApp.value"
		@getNewData="refreshTable"
		@closed="dialog.permission = false"
	></permission-dialog>

</template>

<script setup>

import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";

import SaveDialog from './save'
import PermissionDialog from './permission.vue'
import scSelectFilter from "@/components/scSelectFilter";
import ScStatusIndicator from "@/components/scMini/scStatusIndicator.vue";
import ScTable from "@/components/scTable/index.vue";

const instance = getCurrentInstance();
const properties = instance.appContext.config.globalProperties;

const permissionDialogRef = ref(null);
const saveDialogRef = ref(null);
const table = ref(null);

const state = reactive({
	selection: [],
	search: {
		keyword: null
	},
	appList: [],
	selectedApp: {},
	filterData: [
		{
			title: "所属应用",
			key: "value",
			multiple: false,
			options: [
				// {label: "全部", value: ""},
			]
		}
	]
})

const apiObj = properties.$API.system.role.list;

const dialog = reactive({
	save: false,
	permission: false
})


onMounted(() => {
	getApp()
})

const getApp = async () => {
	const res = await properties.$API.system.app.list.get();
	state.appList = res.data.data;

	//初始化筛选器
	const opts = [];
	res.data.data.forEach(item => {
		opts.push({
			label: item.name,
			value: item.id
		})
	})

	//读取缓存
	const appId = localStorage.getItem("sys_role_app_id");
	if (appId) {
		state.selectedApp = opts.find(item => item.value === Number(appId))
	} else {
		state.selectedApp = opts[0];
	}

	state.filterData[0].options = opts;

	table.value.upData({
		app_id: state.selectedApp.value
	}, 1)

}

const refreshTable = () => {
	table.refresh()
}

const filterChange = (data) => {
	state.selectedApp = data;
	table.value.upData({
		app_id: state.selectedApp.value
	}, 1)
	localStorage.setItem("sys_role_app_id", state.selectedApp.value);
}

const selectionChange = (val) => {
	state.selection = val;
}

//添加
const add = () => {
	dialog.save = true
	nextTick(() => {
		saveDialogRef.value.open().setData({app_id: state.selectedApp.value});
	})
}

const tableEdit = (row) => {
	dialog.save = true;
	nextTick(() => {
		saveDialogRef.value.open('edit').setData(row)
	})
}

//删除
const tableDel = async (row) => {
	const res = await properties.$API.system.role.delete.post({
		ids: row.id
	});
	if (res.code === 0) {
		table.value.upData();
	}
}

//批量删除
const batchDel = async () => {
	const confirmRes = await properties.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
		type: 'warning',
		confirmButtonText: '删除',
		confirmButtonClass: 'el-button--danger'
	});
	if (!confirmRes) return false

	const ids = state.selection.map(v => v.id);
	const res = await properties.$API.system.role.del.post({ids});
	if (res.code === 0) {
		table.value.removeKeys(ids)
		this.$message.success("操作成功")
	} else {
		await properties.$alert(res.message, "提示", {type: 'error'})
	}
}

//权限设置
const openPermission = (row) => {
	dialog.permission = true;
	nextTick(() => {
		permissionDialogRef.value.open(row)
	})
}

//搜索
const upSearch = () => {
	table.value.upData({
		app_id: state.selectedApp.value,
		name: state.search.keyword
	}, 1)
}

// 删除搜索
const clearSearch = () => {
	table.value.reload({
		app_id: state.selectedApp.value
	}, 1)
}

//本地更新数据
const handleSaveSuccess = (data, mode) => {
	if (mode === 'add') {
		table.value.refresh()
	} else if (mode === 'edit') {
		table.value.refresh()
	}
}

</script>
