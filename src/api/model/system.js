import config from "@/config"
import http from "@/utils/request"

export default {
	app: {
		list: {
			url: `${config.API_URL}/admin/system/appList`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		},
		edit: {
			url: `${config.API_URL}/admin/system/editApp`,
			name: "新增或修改应用",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/admin/system/deleteApp`,
			name: "删除应用",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
	},
	rule: {
		list: {
			url: `${config.API_URL}/admin/system/ruleList`,
			name: "获取权限",
			get: async function(data ={}){
				return await http.get(this.url, data);
			}
		},
		edit: {
			url: `${config.API_URL}/admin/system/editRule`,
			name: "编辑权限",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		delete: {
			url: `${config.API_URL}/admin/system/deleteRule`,
			name: "删除权限",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/admin/system/roleList`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/admin/system/editRole`,
			name: "新增或修改角色",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
	},
	menu: {
		list: {
			url: `${config.API_URL}/admin/system/menuList`,
			name: "获取菜单",
			get: async function(data ={}){
				return await http.get(this.url, data);
			}
		},
		edit: {
			url: `${config.API_URL}/admin/system/editMenu`,
			name: "编辑菜单",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		delete: {
			url: `${config.API_URL}/admin/system/deleteMenu`,
			name: "删除菜单",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	dic: {
		tree: {
			url: `${config.API_URL}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	// dept: {
	// 	list: {
	// 		url: `${config.API_URL}/system/dept/list`,
	// 		name: "获取部门列表",
	// 		get: async function(params){
	// 			return await http.get(this.url, params);
	// 		}
	// 	}
	// },
	user: {
		list: {
			url: `${config.API_URL}/admin/system/roleList`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/system/log/list`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
