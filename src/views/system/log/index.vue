<template>
    <el-container>
        <el-aside width="220px">
            <!--      show-checkbox-->
            <el-tree ref="category" class="menu" node-key="label" :data="category"
                     @node-click="test"
                     :default-expanded-keys="['应用日志']"
                     :default-checked-keys="['调试']"
                     current-node-key="应用日志" :highlight-current="true" :expand-on-click-node="false"
            >
            </el-tree>
        </el-aside>
        <el-container>
            <el-main class="nopadding">
                <el-container>
                    <el-header>
                        <div class="left-panel">
                            <el-date-picker @change="timeChange" v-model="date" format="YYYY-MM-DD HH:mm:ss"
                                            type="datetimerange"
                                            range-separator="至" start-placeholder="开始日期"
                                            end-placeholder="结束日期"></el-date-picker>
                        </div>
                        <div class="right-panel">

                        </div>
                    </el-header>
                    <el-header style="height:150px;">
                        <scEcharts height="100%" width="100%" :option="logsChartOption"></scEcharts>
                    </el-header>
                    <el-main class="nopadding">
                        <scTable ref="table" :apiObj="apiObj"
                                 :params="{start_time:date?.[0] || null,end_time:date?.[1] || null}"
                                 stripe
                                 highlightCurrentRow @row-click="rowClick">
                            <!--              <el-table-column label="级别" prop="level" width="60">-->
                            <!--                <template #default="scope">-->
                            <!--                  <el-icon v-if="scope.row.level_name=='error'" style="color: #F56C6C;">-->
                            <!--                    <el-icon-circle-close-filled/>-->
                            <!--                  </el-icon>-->
                            <!--                  <el-icon v-if="scope.row.level_name=='warn'" style="color: #E6A23C;">-->
                            <!--                    <el-icon-warning-filled/>-->
                            <!--                  </el-icon>-->
                            <!--                  <el-icon v-if="scope.row.level_name=='登录日志'" style="color: #409EFF;">-->
                            <!--                    <el-icon-info-filled/>-->
                            <!--                  </el-icon>-->
                            <!--                </template>-->
                            <!--              </el-table-column>-->
                            <el-table-column label="ID" prop="id" width="180"></el-table-column>
                            <el-table-column label="名称" prop="level_name" width="150"></el-table-column>
                            <el-table-column label="标题 " prop="title" width="150"></el-table-column>
                            <el-table-column label="请求来源" prop="request_source" width="150"></el-table-column>
                            <el-table-column label="请求ip" prop="request_ip" width="150"></el-table-column>
                            <el-table-column label="用户" prop="request_user" width="150"></el-table-column>
                            <el-table-column label="请求时间" prop="create_time" width="170">
                                <template #default="{row,$index}">
                                    {{ $TOOL.dateFormat(row.create_time * 1000) }}
                                </template>
                            </el-table-column>
                        </scTable>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
    </el-container>

    <el-drawer v-model="infoDrawer" title="日志详情" :size="600" destroy-on-close>
        <info ref="info"></info>
    </el-drawer>
</template>

<script>
import info from './info'
import scEcharts from '@/components/scEcharts'

export default {
    name: 'log',
    components: {
        info,
        scEcharts
    },
    data() {
        return {
            map: [],
            infoDrawer: false,
            echartsData: [],
            // 动态图表数据
            seriesData: [],
            logsChartOption: {
                color: ['#409eff', '#e6a23c', '#f56c6c'],
                grid: {
                    top: '0px',
                    left: '10px',
                    // right: '10px',
                    bottom: '0px'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: (params) => {
                        let result = ''
                        // let dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#409eff"></span>'    // 定义第一个数据前的圆点颜色
                        // let dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#e6a23c"></span>'    // 定义第二个数据前的圆点颜色
                        // result += params[0].axisValue + "</br>" + dotHtml + ' 登录日志 ' + params[0].data + "</br>" + dotHtml2 + ' 调试 ' + params[1].data;
                        // return result
                        const {seriesData, map} = this
                        if (map.length !== 0) {
                            const xAxis_val = `${params[0].axisValue}</br>`
                            for (let i = 0; i < seriesData.length; i++) {
                                result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${seriesData[i].color}"></span>`
                                result += `${map[i].name}:${params[i].data}`
                                result += `</br>`

                            }
                            result = xAxis_val + result
                        } else {
                            result = '暂无数据'
                        }
                        return result
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['2021-07-01', '2021-07-02', '2021-07-03', '2021-07-04']
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: []
            },
            category: [],
            date: [
                this.$TOOL.dateFormat(this.getCurrentMonthFirst()),
                this.$TOOL.dateFormat(new Date()),
            ],
            apiObj: this.$API.system.log.list,
            search: {
                keyword: ""
            }
        }
    },
    mounted() {
        // const {} = this.date
        this.echarts_render();
    },
    methods: {
        async echarts_render() {
            const start_time = this.date[0]
            const end_time = this.date[1]
            let res = await this.$API.system.log.menu.get({start_time, end_time});
            console.log(res, 'res');

            // 填充图表数据
            let map = res.data.map;
            this.map = res.data.map
            console.log(this.map, 'map')
            if (this.map.length !== 0) {
                for (const key in map) {
                    this.seriesData.push({
                        data: map[key].data,
                        type: 'bar',
                        stack: 'log',
                        barWidth: '15px',
                        color: map[key].color
                    })
                }
                // 填充x轴的数据
                this.logsChartOption.xAxis.data = res.data.dates;
                setTimeout(() => {
                    this.logsChartOption.series = this.seriesData
                }, 500)
            } else {
                this.seriesData = [];
                this.logsChartOption.series = [];
                this.logsChartOption.xAxis.data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                this.$message("暂无更多数据");
            }
            // 左侧树形菜单
            const data = res.data.levels;
            this.category = this.render_TreeMenu(data);
        },
        // 左侧树形菜单
        render_TreeMenu(data) {
            let newMenu = [];
            for (const key in data) {
                if (key === 'app') {
                    newMenu.push({
                        label: "系统日志",
                        children: data[key]
                    })
                } else if (key === 'system') {
                    newMenu.push({
                        label: "应用日志",
                        children: data[key]
                    })
                }
            }
            newMenu.forEach(ele => {
                ele.children.forEach(item => {
                    let temp = item['name']
                    item['name'] = item['label']
                    item['label'] = temp
                })
            })
            return newMenu
        },
        test(a, b, c, d) {
            // let re = this.$refs.category.setCheckedKeys(['错误', '警告'], true)
            // console.log(re, 'res')
            // console.log(a)
            // console.log(b)
            // console.log(c)
            // console.log(d)
            console.log('树形菜单点击')
            console.log(this.seriesData, " this.seriesData")
        },
        timeChange() {
            console.log(this.date, 'this.date')
            // 点击时间清除判断是否为null
            if (this.date !== null) {
                this.$refs.table.upData({
                    start_time: this.date[0],
                    end_time: this.date[1]
                })
                this.echarts_render();
            } else {
                this.$refs.table.upData({
                    start_time: this.date?.[0] || '',
                    end_time: this.date?.[1] || ''
                })
            }
        },
        /*
     * 方法:获取当前月的第一天
    */
        getCurrentMonthFirst() {
            let date = new Date();
            date.setDate(1);
            date.setHours(0, 0, 0, 0)
            return date;
        },
        upsearch() {

        },
        rowClick(row) {
            this.infoDrawer = true
            this.$nextTick(() => {
                this.$refs.info.setData(row)
            })
        }
    }
}


</script>

<style>
</style>