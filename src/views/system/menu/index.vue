<template>
    <el-container>
        <el-aside width="300px" v-loading="menuloading">
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
                    <el-input placeholder="输入关键字过滤" v-model="menuFilterText" clearable style="margin-left: 10px;"></el-input>
                </el-header>
                <el-main class="nopadding">
                    <el-tree ref="menu" class="menu" node-key="id" :data="menuList" :props="menuProps" draggable
                             highlight-current
                             :expand-on-click-node="false" check-strictly show-checkbox
                             :filter-node-method="menuFilterNode"
                             @node-click="menuClick" @node-drop="nodeDrop">

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
                    <el-button type="danger" size="small" plain icon="el-icon-delete" @click="delMenu"></el-button>
                </el-footer>
            </el-container>
        </el-aside>
        <el-container>
            <el-main class="nopadding" style="padding:20px;" ref="main">
                <save ref="save" :menu="menuList" @refreshMenu="refreshMenu"></save>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
let newMenuIndex = 1;
import save from './save'

export default {
    name: "menu",
    components: {
        save
    },
    data() {
        return {
            menuloading: false,
            menuList: [],
            menuProps: {
                label: (data) => {
                    return data.meta.title
                }
            },
            menuFilterText: "",
            appList: [],
            selectedApp: 0
        }
    },
    watch: {
        menuFilterText(val) {
            this.$refs.menu.filter(val);
        },
        selectedApp() {
            this.getMenu();
        }
    },
    mounted() {
        this.getApp();
        this.getMenu();
    },
    methods: {

        async getApp() {
            const res = await this.$API.system.app.list.get({
                pageSize: 50
            });
            this.appList = res.data.rows;
            this.selectedApp = res.data.rows[0].id;
        },

        //加载树数据
        async getMenu() {
            this.menuloading = true
            var res = await this.$API.system.menu.list.get({
                app_id: this.selectedApp
            });
            this.menuloading = false
            this.menuList = res.data;
        },
        //树点击
        menuClick(data, node) {
            var pid = node.level === 1 ? undefined : node.parent.data.id;
            this.$refs.save.setData(data, pid, this.selectedApp)
            this.$refs.main.$el.scrollTop = 0
        },
        //树过滤
        menuFilterNode(value, data) {
            if (!value) return true;
            var targetText = data.meta.title;
            return targetText.indexOf(value) !== -1;
        },
        //树拖拽
        nodeDrop(draggingNode, dropNode, dropType) {
            this.$refs.save.setData({})
            this.$message(`拖拽对象：${draggingNode.data.meta.title}, 释放对象：${dropNode.data.meta.title}, 释放对象的位置：${dropType}`)
        },
        //增加
        async add(node, data) {
            const newMenuName = "未命名" + newMenuIndex++;
            let newMenuData = {
                parentId: data ? data.id : "",
                name: newMenuName,
                path: "",
                component: "",
                meta: {
                    title: newMenuName,
                    type: "menu"
                },
                app_id: this.selectedApp
            }
            this.menuloading = true
            const res = await this.$API.system.menu.edit.post(newMenuData);
            this.menuloading = false
            newMenuData.id = res.data.id

            this.$refs.menu.append(newMenuData, node)
            this.$refs.menu.setCurrentKey(newMenuData.id)
            const pid = node ? node.data.id : "";
            this.$refs.save.setData(newMenuData, pid)
        },
        //删除菜单
        async delMenu() {
            const CheckedNodes = this.$refs.menu.getCheckedNodes();
            if (CheckedNodes.length === 0) {
                this.$message.warning("请选择需要删除的项")
                return false;
            }

            const confirm = await this.$confirm('确认删除已选择的菜单吗？', '提示', {
                type: 'warning',
                confirmButtonText: '删除',
                confirmButtonClass: 'el-button--danger'
            }).catch(() => {})
            if (confirm !== 'confirm') {
                return false
            }

            this.menuloading = true
            const reqData = {
                ids: CheckedNodes.map(item => item.id)
            };
            const res = await this.$API.system.menu.delete.post(reqData);
            this.menuloading = false

            if (res.code === 0) {
                CheckedNodes.forEach(item => {
                    var node = this.$refs.menu.getNode(item)
                    if (node.isCurrent) {
                        this.$refs.save.setData({})
                    }
                    this.$refs.menu.remove(item)
                })
            } else {
                this.$message.warning(res.message)
            }
        },
        // 子组件刷新菜单
        refreshMenu() {
            this.getMenu();
        }
    }
}
</script>

<style scoped>
.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
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
