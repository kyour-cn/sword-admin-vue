<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length === 0"
									 @click="batch_del"></el-button>
			</div>
		</el-header>
		<el-main class="nopadding">
			<sc-table ref="table" :apiObj="list.apiObj" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="名称" prop="name" width="180"></el-table-column>
				<el-table-column label="应用key" prop="key" width="180"></el-table-column>
				<el-table-column label="备注信息" prop="remark"></el-table-column>
				<el-table-column label="状态" prop="status" width="60">
					<template #default="scope">
						<sc-status-indicator v-if="scope.row.status" type="success"></sc-status-indicator>
						<sc-status-indicator v-if="!scope.row.status" pulse type="danger"></sc-status-indicator>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="300">
					<template #default="scope">
						<el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
						<el-button type="primary" plain size="small" @click="table_edit(scope.row)">编辑</el-button>
						<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
							<template #reference>
								<el-button plain type="danger" size="small">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</sc-table>
		</el-main>
	</el-container>

	<save-dialog
		v-if="dialog.save"
		ref="saveDialog"
		@success="handleSaveSuccess"
		@closed="dialog.save=false"
	/>

	<el-drawer v-model="dialog.info" :size="800" title="详细" class="drawerBG" direction="rtl" destroy-on-close>
		<info ref="infoDialog"></info>
	</el-drawer>

</template>

<script>
import saveDialog from './save'
import info from './info'
import ScStatusIndicator from "@/components/scMini/scStatusIndicator.vue";
import ScTable from "@/components/scTable/index.vue";

export default {
	name: 'app',
	components: {
		ScTable,
		ScStatusIndicator,
		saveDialog,
		info
	},
	data() {
		return {
			dialog: {
				save: false,
				info: false
			},
			list: {
				apiObj: this.$API.system.app.list
			},
			selection: []
		}
	},
	methods: {
		//窗口新增
		add() {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open()
			})
		},
		//窗口编辑
		table_edit(row) {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('edit').setData(row)
			})
		},
		//查看
		table_show(row) {
			this.dialog.info = true
			this.$nextTick(() => {
				this.$refs.infoDialog.setData(row)
			})
		},
		//删除明细
		async table_del(row, index) {
			var reqData = {ids: row.id}
			var res = await this.$API.system.app.del.post(reqData);
			if (res.code === 0) {
				this.$refs.table.removeIndex(index)
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
			var res = await this.$API.system.app.del.post({ids});
			if (res.code === 0) {
				this.$refs.table.removeKeys(ids)
				this.$message.success("操作成功")
			} else {
				this.$alert(res.message, "提示", {type: 'error'})
			}
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection
		},
		//本地更新数据
		handleSaveSuccess(data, mode) {
			this.$refs.table.refresh()
		}
	}
}
</script>

<style>
</style>
