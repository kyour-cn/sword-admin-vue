<template>
	<el-row :gutter="40">
		<el-col v-if="!form.id">
			<el-empty description="请选择左侧菜单后操作" :image-size="100"></el-empty>
		</el-col>
		<template v-else>
			<el-col :lg="24">
				<h2>{{form.name || "新增权限"}}</h2>
				<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
					<el-form-item label="权限ID" prop="id">
						<el-input v-model="form.id" clearable disabled></el-input>
					</el-form-item>
					<el-form-item label="显示名称" prop="name">
						<el-input v-model="form.name" clearable placeholder="权限显示名字"></el-input>
					</el-form-item>
					<el-form-item label="上级权限" prop="parentId">
						<el-cascader v-model="form.parentId" :options="ruleOptions" :props="ruleProps" :show-all-levels="false"
									 placeholder="顶级权限" clearable></el-cascader>
					</el-form-item>
					<el-form-item label="路由地址" prop="path">
						<el-input v-model="form.path" clearable placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="别名" prop="name">
						<el-input v-model="form.alias" clearable placeholder="权限别名"></el-input>
						<div class="el-form-item-msg">别名用于进行功能权限验证</div>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input v-model="form.sort" clearable placeholder="权限排序"></el-input>
						<div class="el-form-item-msg">正序排列，数字越小越靠前</div>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="save" :loading="loading">保 存</el-button>
					</el-form-item>
				</el-form>

			</el-col>
		</template>
	</el-row>

</template>

<script>
import scIconSelect from '@/components/scIconSelect'

export default {
	components: {
		scIconSelect
	},
	props: {
		rule: { type: Object, default: () => { } },
	},
	data() {
		return {
			form: {
				id: "",
				appid: 0,
				parentId: "",
				name: "",
				alias: "",
				path: "",
				sort: 0,
			},
			ruleOptions: [],
			ruleProps: {
				value: 'id',
				label: 'name',
				checkStrictly: true
			},
			apiListAddTemplate: {
				code: "",
				url: ""
			},
			loading: false,
			appId: 0
		}
	},
	watch: {
		rule: {
			handler() {
				this.ruleOptions = this.treeToMap(this.rule)
			},
			deep: true
		}
	},
	mounted() {

	},
	methods: {
		//简单化菜单
		treeToMap(tree) {
			let map = [];
			tree.forEach(item => {
				const obj = {
					id: item.id,
					parentId: item.parentId,
					name: item.name,
					children: item.children && item.children.length > 0 ? this.treeToMap(item.children) : null
				}
				map.push(obj)
			})
			return map
		},
		//保存
		async save() {
			this.loading = true
			const res = await this.$API.system.rule.edit.post(this.form)
			this.loading = false
			if (res.code === 0) {
				this.$message.success("保存成功")
				this.$emit('refreshRule')
			} else {
				this.$message.warning(res.message)
			}
		},
		//表单注入数据
		setData(data, pid, appId) {
			this.form = data
			this.form.parentId = pid
			this.form.appid = appId
		}
	}
}
</script>

<style scoped>
h2 {
	font-size: 17px;
	color: #3c4a54;
	padding: 0 0 30px 0;
}
.apilist {
	border-left: 1px solid #eee;
}

[data-theme="dark"] h2 {
	color: #fff;
}
[data-theme="dark"] .apilist {
	border-color: #434343;
}
</style>
