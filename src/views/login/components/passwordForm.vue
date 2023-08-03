<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="user">
			<el-input v-model="form.user" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
				<!--				<template #append>-->
				<!--					<el-select v-model="userType" style="width: 130px;">-->
				<!--						<el-option :label="$t('login.admin')" value="admin"></el-option>-->
				<!--						<el-option :label="$t('login.user')" value="user"></el-option>-->
				<!--					</el-select>-->
				<!--				</template>-->
			</el-input>
		</el-form-item>

		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password
								:placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>

		<el-form-item prop="code">
			<el-input v-model="form.code" prefix-icon="el-icon-picture" clearable placeholder="图形验证码">
				<template #append>
					<img @click="onRefresh" style="height: 30px;" :src="codeSrc+ '?number=' + codeNumber" alt="">
				</template>
			</el-input>
		</el-form-item>

		<el-form-item style="margin-bottom: 10px;">
			<el-col :span="12">
				<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
			</el-col>
			<el-col :span="12" class="login-forgot">
				<router-link to="/reset_password">{{ $t('login.forgetPassword') }}？</router-link>
			</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">
				{{ $t('login.signIn') }}
			</el-button>
		</el-form-item>
		<div class="login-reg">
			{{ $t('login.noAccount') }}
			<router-link to="/user_register">{{ $t('login.createAccount') }}</router-link>
		</div>
	</el-form>
</template>

<script>
import config from "@/config"
import auth from "@/api/model/auth";

export default {
	data() {
		return {
			userType: 'admin',
			form: {
				user: "admin",
				password: "123456",
				autologin: false,
				code: '',
			},
			rules: {
				user: [
					{required: true, message: this.$t('login.userError'), trigger: 'blur'}
				],
				password: [
					{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
				]
			},
			islogin: false,

			codeNumber: Math.round(Math.random() * (100000 - 999999) + 999999), //验证码编号
			codeSrc: config.API_URL + auth.captchaImg
		}
	},
	watch: {
		userType(val) {
			if (val == 'admin') {
				this.form.user = 'admin'
				this.form.password = '123456'
			} else if (val == 'user') {
				this.form.user = 'user'
				this.form.password = '123456'
			}
		}
	},
	methods: {
		onRefresh() {
			this.codeNumber = Math.round(Math.random() * (100000 - 999999) + 999999) //验证码编号
		},
		async login() {

			const validate = await this.$refs.loginForm.validate().catch()
			if (!validate) {
				return false
			}

			this.islogin = true
			const data = {
				username: this.form.user,
				password: this.$TOOL.crypto.MD5(this.form.password),
				md5: true,
				code: this.form.code,
				number: this.codeNumber
			};
			//获取token
			const user = await this.$API.auth.token.post(data);
			if (user.code === 0) {
				this.$TOOL.cookie.set("TOKEN", user.data.token, {
					expires: this.form.autologin ? 24 * 60 * 60 : 0
				})
				this.$TOOL.data.set("USER_INFO", user.data.userInfo)
			} else {
				this.islogin = false
				this.$message.warning(user.message)
				this.onRefresh()
				return false
			}
			//获取菜单
			const menu = await this.$API.auth.menu.get();
			if (menu.code === 0) {
				if (menu.data.menu.length === 0) {
					this.islogin = false
					await this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
						type: 'error',
						center: true
					})
					return false
				}
				this.$TOOL.data.set("MENU", menu.data.menu)
				// this.$TOOL.data.set("PERMISSIONS", menu.data.permissions)
			} else {
				this.islogin = false
				this.$message.warning(menu.message)
				return false
			}
			//默认路由地址
			const defaultRoute = config.DASHBOARD_URL;

			//递归菜单及子菜单，判断是否存在默认路由
			const findDefaultRoute = (menu) => {
				for (let i = 0; i < menu.length; i++) {
					if (menu[i].path === defaultRoute) {
						return true
					}
					if (menu[i].children && menu[i].children.length) {
						return findDefaultRoute(menu[i].children)
					}
				}
				return false
			}
			//不存在默认路由，跳转到第一个菜单
			if (!findDefaultRoute(menu.data.menu)) {
				//取第一个菜单
				let menuItem = menu.data.menu[0];
				if (menuItem.children.length) {
					menuItem = menuItem.children[0]
				}
				this.$router.replace({
					path: menuItem.path
				})
			} else {
				this.$router.replace({
					path: '/'
				})
			}

			this.$message.success("登录成功")
			this.islogin = false
		}
	}
}
</script>

<style>
</style>
