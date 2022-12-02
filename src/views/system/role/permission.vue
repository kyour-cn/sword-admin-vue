<template>
	<el-dialog title="角色权限设置" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">

		<div class="treeMain">
			<el-tree ref="rule" node-key="id" :data="rule.list" :props="rule.props" show-checkbox></el-tree>
		</div>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				visible: false,
				isSaveing: false,
				appId: 0,
				row:{},
				rule: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.name
						}
					}
				},
			}
		},
		mounted() {
			this.getRule()
		},
		methods: {
			open(row){
				this.row = row
				this.visible = true;
			},
			async submit(){
				this.isSaveing = true;
				//选中的和半选的合并后传值接口
				var checkedKeys = this.$refs.rule.getCheckedKeys().concat(this.$refs.rule.getHalfCheckedKeys())
				let checkIds = checkedKeys.join(',');
				const data ={rules:checkIds,id:this.row.id}
				const res = await this.$API.system.role.edit.post(data);
				if(res.code == 0 ){
					this.isSaveing = false;
					this.visible = false;
					this.$message.success("操作成功")
					this.$emit('success')
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			async getRule(){
				const res = await this.$API.system.rule.list.get({
					appid: this.appId
				});
				this.rule.list = res.data

				//获取接口返回的之前选中的和半选的合并，处理过滤掉有叶子节点的key
				this.rule.checked = [
					// "system", "user", "user.add", "user.edit", "user.del", "directive.edit", "other", "directive"
				]
				this.$nextTick(() => {
					let filterKeys = this.rule.checked.filter(key => this.$refs.rule.getNode(key).isLeaf)
					this.$refs.rule.setCheckedKeys(filterKeys, true)
				})
			}
		}
	}
</script>

<style scoped>
	.treeMain {height:280px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
