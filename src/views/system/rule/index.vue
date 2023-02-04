<template>
	<el-container>
		<el-aside width="300px" v-loading="loading">
			<el-container>
				<el-header>
					<el-select v-model="selectedApp">
						<el-option
							v-for="item in appList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
					<el-input placeholder="输入关键字过滤" v-model="ruleFilterText" clearable style="margin-left: 10px;"></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="rule" class="rule" node-key="id" :data="ruleList" :props="ruleProps" draggable highlight-current
							 :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="ruleFilterNode"
							 @node-click="ruleClick" @node-drop="nodeDrop">

						<template #default="{node, data}">
                            <span class="custom-tree-node">
                                <span class="label">
                                    {{ node.label }}
                                </span>
                                <span class="do">
                                    <el-button icon="el-icon-plus" size="small" @click.stop="add(node, data)"></el-button>
                                </span>
                            </span>
						</template>

					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="add()"></el-button>
					<el-button type="danger" size="small" plain icon="el-icon-delete" @click="delRule"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container>
			<el-main class="nopadding" style="padding:20px;" ref="main">
				<save ref="save" :rule="ruleList" @refreshRule="refreshRule"></save>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
let newRuleIndex = 1;
import save from './save'

export default {
	name: "rule",
	components: {
		save
	},
	data() {
		return {
			loading: false,
			ruleList: [],
			ruleProps: {
				label: (data) => {
					return data.name
				}
			},
			ruleFilterText: "",
			appList: [
			],
			selectedApp: 0
		}
	},
	watch: {
		ruleFilterText(val) {
			this.$refs.rule.filter(val);
		},
		selectedApp(){
			this.getRule();
		}
	},
	mounted() {

		this.getApp();

		this.getRule();
	},
	methods: {

		async getApp() {
			const res = await this.$API.system.app.list.get();
			this.appList = res.data.rows;
			this.selectedApp = res.data.rows[0].id;
		},

		//加载树数据
		async getRule() {
			this.loading = true
			const res = await this.$API.system.rule.list.get({
				appid: this.selectedApp
			});
			this.loading = false
			this.ruleList = res.data;
		},
		//树点击
		ruleClick(data, node) {
			const pid = node.level == 1 ? undefined : node.parent.data.id;
			this.$refs.save.setData(data, pid, this.selectedApp)
			this.$refs.main.$el.scrollTop = 0
		},
		//树过滤
		ruleFilterNode(value, data) {
			if (!value) return true;
			const targetText = data.meta.title;
			return targetText.indexOf(value) !== -1;
		},
		//树拖拽
		nodeDrop(draggingNode, dropNode, dropType) {
			this.$refs.save.setData({})
			this.$message(`拖拽对象：${draggingNode.data.meta.title}, 释放对象：${dropNode.data.meta.title}, 释放对象的位置：${dropType}`)
		},
		//增加
		async add(node, data) {
			const newRuleName = "未命名" + newRuleIndex++;
			let newRuleData = {
				parentId: data ? data.id : "",
				name: newRuleName,
				path: "",
				appid: this.selectedApp
			};
			this.loading = true
			const res = await this.$API.system.rule.edit.post(newRuleData);
			this.loading = false
			newRuleData = res.data

			this.$refs.rule.append(newRuleData, node)
			this.$refs.rule.setCurrentKey(newRuleData.id)
			const pid = node ? node.data.id : "";
			this.$refs.save.setData(newRuleData, pid)
		},
		//删除权限
		async delRule() {
			const CheckedNodes = this.$refs.rule.getCheckedNodes();
			if (CheckedNodes.length === 0) {
				this.$message.warning("请选择需要删除的项")
				return false;
			}

			const confirm = await this.$confirm('确认删除已选择的权限吗？', '提示', {
				type: 'warning',
				confirmButtonText: '删除',
				confirmButtonClass: 'el-button--danger'
			}).catch(() => {
			});
			if (confirm !== 'confirm') {
				return false
			}

			this.loading = true
			const reqData = {
				ids: CheckedNodes.map(item => item.id)
			}
			let res = await this.$API.system.rule.delete.post(reqData)
			this.loading = false

			if (res.code === 0) {
				CheckedNodes.forEach(item => {
					const node = this.$refs.rule.getNode(item);
					if (node.isCurrent) {
						this.$refs.save.setData({})
					}
					this.$refs.rule.remove(item)
				})
			} else {
				this.$message.warning(res.message)
			}
		},
		// 子组件刷新
		refreshRule() {
			this.getRule();
		}
	}
}
</script>

<style scoped>
.rule:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
.custom-tree-node {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
    height:100%;
    padding-right:24px;
}
.custom-tree-node .label {
	display: flex;
	align-items: center;
	height: 100%;
}
.custom-tree-node .label .el-tag {
	margin-left: 5px;
}
.custom-tree-node .do {
	display: none;
}
.custom-tree-node .do i {
	margin-left: 5px;
	color: #999;
}
.custom-tree-node .do i:hover {
	color: #333;
}

.custom-tree-node:hover .do {
	display: inline-block;
}
</style>
