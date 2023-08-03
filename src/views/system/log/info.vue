<template>

	<el-main style="padding:0 20px;">
		<el-descriptions :column="1" border size="small">
			<el-descriptions-item label="标题">{{ data.title }}</el-descriptions-item>
			<el-descriptions-item label="日志类型">{{ data.level_name }}</el-descriptions-item>
			<el-descriptions-item label="请求来源">{{ data.request_source }}</el-descriptions-item>
			<el-descriptions-item label="操作人">{{ data.request_user }} （{{ data.request_user_id }}）</el-descriptions-item>
			<el-descriptions-item label="请求ip">{{ data.request_ip }}</el-descriptions-item>
			<el-descriptions-item label="请求时间">{{ $TOOL.dateFormat(data.create_time * 1000) }}</el-descriptions-item>
		</el-descriptions>
		<el-collapse v-model="activeNames" style="margin-top: 20px;">
			<el-collapse-item title="记录内容" name="1">
				<div class="code">
					{{data.value}}
				</div>
			</el-collapse-item>
		</el-collapse>
	</el-main>
</template>

<script>
export default {
	data() {
		return {
			data: {},
			activeNames: ['1'],
			typeMap: {
				'info': "info",
				'warn': "warning",
				'error': "error"
			}
		}
	},
	methods: {
		setData(data) {
			this.data = data
		}
	}
}
</script>

<style scoped>
:deep(.is-bordered-label) {
	min-width: 6em;
}

.code {
	background: #848484;
	padding: 15px;
	color: #fff;
	font-size: 12px;
	border-radius: 4px;
}
</style>