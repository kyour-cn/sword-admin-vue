<template>
	<el-container>
		<el-aside width="220px">
			<el-tree
				ref="category"
				class="menu"
				node-key="label"
				:data="category"
				:default-expanded-keys="['应用日志', '系统日志']"
				:highlight-current="true"
				:expand-on-click-node="false"
				@current-change="handleCurrentChange"
			/>
		</el-aside>
		<el-container>
			<el-main class="nopadding">
				<el-container>
					<el-header>
						<div class="left-panel">
							<el-date-picker
								v-model="date"
								format="YYYY-MM-DD HH:mm:ss"
								type="datetimerange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								@change="timeChange"
							/>
						</div>
						<div class="right-panel">

						</div>
					</el-header>
					<el-header style="height:150px;">
						<scEcharts height="100%" width="100%" :option="logsChartOption"></scEcharts>
					</el-header>
					<el-main class="nopadding">
						<scTable
							ref="table" :apiObj="apiObj"
							:params="{start_time:date?.[0] || null,end_time:date?.[1] || null}"
							stripe
							highlightCurrentRow @row-click="rowClick">
							<el-table-column label="ID" prop="id" width="100"></el-table-column>
							<el-table-column label="名称" prop="level_name" width="100"></el-table-column>
							<el-table-column label="标题" show-overflow-tooltip prop="title"></el-table-column>
							<el-table-column label="请求来源" show-overflow-tooltip prop="request_source" width="250"></el-table-column>
							<el-table-column label="请求ip" prop="request_ip" width="150"></el-table-column>
							<el-table-column label="用户" prop="request_user" width="100"></el-table-column>
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

			// 填充图表数据
			let map = res.data.map;
			this.map = res.data.map
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
			this.category = this.renderTreeMenu(data);
		},
		// 左侧树形菜单
		renderTreeMenu(data) {
			let newMenu = [];
			for (const key in data) {
				if (key === 'app') {
					newMenu.push({
						id: key,
						label: "应用日志",
						children: data[key]
					})
				} else if (key === 'system') {
					newMenu.push({
						id: key,
						label: "系统日志",
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
		timeChange() {
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
		//获取当前月的第一天
		getCurrentMonthFirst() {
			let date = new Date();
			date.setDate(1);
			date.setHours(0, 0, 0, 0)
			return date;
		},
		rowClick(row) {
			this.infoDrawer = true
			this.$nextTick(() => {
				this.$refs.info.setData(row)
			})
		},
		handleCurrentChange(data) {
			this.$refs.table.upData({
				level_id: data.id
			})
		},
	}
}

</script>

<style>
</style>