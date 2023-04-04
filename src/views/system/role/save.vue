<template>
	<el-dialog v-model="visible" :title="titleMap[mode]" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form ref="dialogForm" :disabled="mode=='show'" :model="form" :rules="rules" label-position="left"
				 label-width="100px">
			<el-form-item label="角色名称" prop="label">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" :min="1" controls-position="right"
								 style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="true" :inactive-value="false"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" clearable type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false">取 消</el-button>
			<el-button v-if="mode!='show'" :loading="isSaveing" type="primary" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	emits: ['success', 'closed'],
	props: ['selectedApp'],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: '新增',
				edit: '编辑',
				show: '查看'
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				name: "",
				sort: 1,
				status: 1,
				remark: ""
			},
			//验证规则
			rules: {
				sort: [
					{required: true, message: '请输入排序', trigger: 'change'}
				],
				name: [
					{required: true, message: '请输入角色名称'}
				]
			}
		}
	},
	mounted() {
		// console.log(this.selectedApp,"selectedApp")
	},
	methods: {
		//显示
		open(mode = 'add') {
			this.mode = mode;
			this.visible = true;
			return this
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (!valid) {
					return false
				}
				this.isSaveing = true;
				const data = this.form
				data.status = data.status ? 1 : 0;
				// 带上父组件传下来的selectedApp
				data.app_id = this.selectedApp
				const res = await this.$API.system.role.edit.post(data);
				this.isSaveing = false;
				this.visible = false;
				if (res.code === 0) {
					this.$emit('success', this.form, this.mode)
					this.$message.success("操作成功")
				} else {
					this.$alert(res.message, "提示", {type: 'error'})
				}
			})
		},
		//表单注入数据
		setData(data) {
			this.form.id = data.id
			this.form.name = data.name
			this.form.remark = data.remark
			this.form.status = data.status === 1 ? true : false
			this.form.sort = data.sort

			//可以和上面一样单个注入，也可以像下面一样直接合并进去
			//Object.assign(this.form, data)
		}
	}
}
</script>

<style>
</style>
