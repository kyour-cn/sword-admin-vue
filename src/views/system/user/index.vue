<template>
    <el-container>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
					<el-button type="primary" plain :disabled="selection.length==0">分配角色</el-button>
					<el-button type="primary" plain :disabled="selection.length==0">密码重置</el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
            <el-input v-model="search.keyword" placeholder="登录账号 / 姓名" @clear="clearSearch" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<sc-table ref="table" :apiObj="apiObj" @selection-change="selectionChange" stripe remoteSort remoteFilter>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="ID" prop="id" width="80" sortable='custom'></el-table-column>
					<el-table-column label="头像" width="80" column-key="filterAvatar" >
						<template #default="scope">
							<el-avatar :src="scope.row.avatar" size="small"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column label="登录账号" prop="username" width="150"  column-key="filterUserName" ></el-table-column>
					<el-table-column label="姓名" prop="realname" width="150" ></el-table-column>
					<el-table-column label="手机号" prop="mobile" width="150" ></el-table-column>
					<el-table-column label="所属角色" prop="role_name" width="200" ></el-table-column>
          <el-table-column label="注册时间" prop="register_time" width="170">
            <template #default="{row,$index}">
              {{ $TOOL.dateFormat(row.register_time * 1000) }}
            </template>
          </el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="160">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
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
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @reloadData="reloadData"  @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'user',
		components: {
			saveDialog
		},
		data() {
			return {
				dialog: {
					save: false
				},
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.user.list,
				selection: [],
				search: {
          keyword: null
        }
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {
			// this.getGroup()
		},
		methods: {
			// 子组件刷新数据
			reloadData(){
				this.$refs.table.reload();
			},
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//删除
			async table_del(row, index){
				var reqData = {ids: row.id}
				var res = await this.$API.system.user.delete.post(reqData);
				if(res.code == 0){
					//这里选择刷新整个表格 OR 插入/编辑现有表格数据
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					const loading = this.$loading();
					const ids =this.selection.map( ele => ele.id )
					var res = await this.$API.system.user.delete.post({ids});
					if(res.code === 0){
						this.selection.forEach(item => {
							this.$refs.table.tableData.forEach((itemI, indexI) => {
								if (item.id === itemI.id) {
									this.$refs.table.tableData.splice(indexI, 1)
								}
							})
						})
						loading.close();
						this.$message.success("操作成功")
					}else{
						this.$alert(res.message, "提示", {type: 'error'})
					}
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getGroup(){
				this.showGrouploading = true;
				var res = await this.$API.system.dept.list.get();
				this.showGrouploading = false;
				var allNode ={id: '', label: '所有'}
				res.data.unshift(allNode);
				this.group = res.data;
			},
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//树点击事件
			groupClick(data){
				var params = {
					groupId: data.id
				}
				this.$refs.table.reload(params)
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
      // 清除搜索
      clearSearch(){
        this.$refs.table.upData(this.search)
      },
			//本地更新数据
			handleSuccess(data, mode){
				if(mode=='add'){
					data.id = new Date().getTime()
					this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
		}
	}
</script>

<style>
</style>
