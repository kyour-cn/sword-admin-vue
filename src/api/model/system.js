import config from "@/config"
import http from "@/utils/request"

export default {
	app: {
		list: {
			url: `${config.API_URL}/app/admin/system/appList`,
			name: "应用列表",
			get: async function(params={}){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/app/admin/system/editApp`,
			name: "新增或修改应用",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/app/admin/system/deleteApp`,
			name: "删除应用",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	rule: {
		list: {
			url: `${config.API_URL}/app/admin/system/ruleList`,
			name: "获取权限",
			get: async function(params ={}){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/app/admin/system/editRule`,
			name: "编辑权限",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		delete: {
			url: `${config.API_URL}/app/admin/system/deleteRule`,
			name: "删除权限",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/app/admin/system/roleList`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/app/admin/system/editRole`,
			name: "新增或修改角色",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		del: {
			url: `${config.API_URL}/app/admin/system/deleteRole`,
			name: "删除应用",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	menu: {
		list: {
			url: `${config.API_URL}/app/admin/system/menuList`,
			name: "获取菜单",
			get: async function(params ={}){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/app/admin/system/editMenu`,
			name: "编辑菜单",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		delete: {
			url: `${config.API_URL}/app/admin/system/deleteMenu`,
			name: "删除菜单",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/app/admin/system/userList`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL}/app/admin/system/editUser`,
			name: "编辑用户",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		},
		delete: {
			url: `${config.API_URL}/app/admin/system/deleteUser`,
			name: "删除用户",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/app/admin/system/logList`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
}
