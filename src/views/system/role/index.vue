<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0"
						   @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="角色名称" clearable @clear="clearSearch"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-header style="height: auto;">
			<sc-select-filter v-if="selectedApp" :data="filterData" :selected-values="selectedApp" :label-width="80"
							  @on-change="filterChange"></sc-select-filter>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="name" width="150"></el-table-column>
				<!--				<el-table-column label="别名" prop="alias" width="200"></el-table-column>-->
				<el-table-column label="排序" prop="sort" width="80"></el-table-column>
				<!--				<el-table-column label="状态" prop="status" width="80">-->
				<!--					<template #default="scope">-->
				<!--						<el-switch  v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" active-value="1" inactive-value="0"></el-switch>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<el-table-column label="状态" prop="status" width="60">
					<template #default="scope">
						<sc-status-indicator v-if="scope.row.status" type="success"></sc-status-indicator>
						<sc-status-indicator v-if="!scope.row.status" pulse type="danger"></sc-status-indicator>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="create_time" width="180"></el-table-column>
				<el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="300">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">
								查看
							</el-button>
							<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">
								编辑
							</el-button>
							<el-button text type="primary" size="small" @click="permission(scope.row, scope.$index)">
								权限设置
							</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog
        v-if="dialog.save"
        ref="saveDialog"
        :selectedApp="selectedApp"
        @success="handleSaveSuccess"
        @closed="dialog.save=false"
    ></save-dialog>

	<permission-dialog
        v-if="dialog.permission"
        ref="permissionDialog"
        :app-id="selectedApp"
        @getNewData="getNewData"
        @closed="dialog.permission=false"
    ></permission-dialog>

</template>

<script>
import saveDialog from './save'
import permissionDialog from './permission'
import scSelectFilter from "@/components/scSelectFilter";

export default {
	name: 'role',
	components: {
		saveDialog,
		permissionDialog,
		scSelectFilter
	},
	data() {
		return {
			dialog: {
				save: false,
				permission: false
			},
			apiObj: this.$API.system.role.list,
			selection: [],
			search: {
				keyword: null
			},
			appList: [],
			selectedApp: 0,
			filterData: [
				{
					title: "所属应用",
					key: "id",
					multiple: false,
					options: [
						// {
						// 	label: "全部",
						// 	value: ""
						// },
					]
				}
			],
		}
	},
	mounted() {
		this.getApp()
	},
	methods: {
		getNewData() {
			this.$refs.table.refresh()
		},
		async getApp() {
			const res = await this.$API.system.app.list.get({
				pageSize: 50
			});
			this.appList = res.data.rows;
			this.selectedApp = res.data.rows[0].id;

			this.$refs.table.upData({
				appid: this.selectedApp
			}, 1)

			//初始化筛选器
			res.data.rows.forEach(item => {
				this.filterData[0].options.push({
					label: item.name,
					value: item.id
				})
			})

		},
		filterChange(data) {
			this.selectedApp = data.id
			this.$refs.table.upData({
				appid: this.selectedApp
			}, 1)
		},
		//添加
		add() {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open()
			})
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('edit').setData(row)
			})
		},
		//查看
		table_show(row) {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('show').setData(row)
			})
		},
		//权限设置
		permission(row, index) {
			this.dialog.permission = true
			this.$nextTick(() => {
				this.$refs.permissionDialog.open(row)
			})
		},
		//删除
		async table_del(row) {
			const reqData = {ids: row.id}
			const res = await this.$API.system.role.del.post(reqData);
			if (res.code === 0) {
				this.$refs.table.refresh()
				this.$message.success("删除成功")
			} else {
				this.$alert(res.message, "提示", {type: 'error'})
			}
		},
		//批量删除
		async batch_del() {
			var confirmRes = await this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
				type: 'warning',
				confirmButtonText: '删除',
				confirmButtonClass: 'el-button--danger'
			}).catch(() => {
			})

			if (!confirmRes) {
				return false
			}

			var ids = this.selection.map(v => v.id)
			var res = await this.$API.system.role.del.post({ids});
			if (res.code === 0) {
				this.$refs.table.removeKeys(ids)
				this.$message.success("操作成功")
			} else {
				this.$alert(res.message, "提示", {type: 'error'})
			}
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//表格内开关
		changeSwitch(val, row) {
			row.status = row.status == '1' ? '0' : '1'
			row.$switch_status = true;
			setTimeout(() => {
				delete row.$switch_status;
				row.status = val;
				this.$message.success("操作成功")
			}, 500)
		},
		//搜索
		upsearch() {
			this.$refs.table.upData({
				appid: this.selectedApp,
				name: this.search.keyword
			}, 1)
		},
		// 删除搜索
		clearSearch() {
			this.$refs.table.reload({
				appid: this.selectedApp,
			}, 1)
		},
		//根据ID获取树结构
		filterTree(id) {
			var target = null;

			function filter(tree) {
				tree.forEach(item => {
					if (item.id == id) {
						target = item
					}
					if (item.children) {
						filter(item.children)
					}
				})
			}

			filter(this.$refs.table.tableData)
			return target
		},
		//本地更新数据
		handleSaveSuccess(data, mode) {
			if (mode == 'add') {
				this.$refs.table.refresh()
			} else if (mode == 'edit') {
				this.$refs.table.refresh()
			}
		}
	}
}
</script>

<style>
</style>
