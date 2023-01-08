import config from "@/config"
import http from "@/utils/request"

export default {
	captchaImg: '/app/admin/Login/captcha',
	token: {
		url: `${config.API_URL}/app/admin/login/index`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	menu: {
		url: `${config.API_URL}/app/admin/index/menu`,
		name: "获取我的菜单",
		get: async function(){
			return await http.get(this.url);
		}
	}
}
