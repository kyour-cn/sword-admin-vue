<template>
  <div id="company_management">
    <el-card class="box-card">
      <template #header>
        <el-button type="primary" icon="el-icon-plus" style="margin-right:20px" @click="test">添加</el-button>
        <el-input style="width:200px" v-model="searchValue" class="w-50 m-2" placeholder="请输入公司名称"
          :prefix-icon="Search" />
      </template>
      <!-- table表单 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="公司名称11111" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Name" width="180">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>name: {{ scope.row.name }}</div>
                <div>address: {{ scope.row.address }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
export default {
  components: { Search },
  data() {
    return {
      searchValue: '',
      tableData: [

      ]
    }
  },
  mounted() {
    this.getCompanyList();
  },
  methods: {
    test() {
      console.log(this.searchValue);
    },
    async getCompanyList() {
      let res = await this.$API.mock.menu.list.get();
      console.log("res:");
      console.log(res);
      if (res.code = 0) {
        this.tableData = res.data;
      }
    }
  }
}
</script>


<script  setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
const searchValue = ref('')
</script> */



<style lang="scss" scoped>
#company_management {
  padding: 20px;
}
</style>