<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
<!--			<el-form-item label="头像" prop="avatar">-->
<!--				<sc-upload v-model="form.avatar" title="上传头像"></sc-upload>-->
<!--			</el-form-item>-->
			<el-form-item label="登录账号" prop="username">
				<el-input v-model="form.username" placeholder="用于登录系统" clearable></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="realname">
				<el-input v-model="form.realname" placeholder="请输入完整的真实姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="form.mobile" placeholder="请输入手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="true" :inactive-value="false"></el-switch>
			</el-form-item>
			<template v-if="mode=='add'">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>
			<template v-if="mode=='edit'">
				<el-form-item label="修改密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
			</template>
			<el-form-item label="确认角色" prop="role_name">
				<roleSelect @onChange="change" :placeholder="form.role_name" />
			</el-form-item>

		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
import roleSelect from "@/components/system/roleSelect";
	export default {
		emits: ['success', 'closed','reloadData'],
		components:{roleSelect},
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增用户',
					edit: '编辑用户',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					id:"",
					username: "aa",
					// avatar: "",
					realname: "aa",
					status:true,
					password: 'aa',
					password2:"aa",
					mobile:'18328560757',
					role:undefined,
				},
				//验证规则
				rules: {
					avatar:[
						{required: true, message: '请上传头像'}
					],
					username: [
						{required: true, message: '请输入登录账号'}
					],
					realname: [
						{required: true, message: '请输入真实姓名'}
					],
					mobile: [
						{required: true, message: '请输入手机号'}
					],
					password: [
						{required: true, message: '请输入登录密码'},
						{validator: (rule, value, callback) => {
							if (this.form.password2 !== '') {
								this.$refs.dialogForm.validateField('password2');
							}
							callback();
						}}
					],
					password2: [
						{required: true, message: '请再次输入密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(new Error('两次输入密码不一致!'));
							}else{
								callback();
							}
						}}
					],
					status: [
						{required: true, message: '请选择当前状态'}
					]
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "id",
					multiple: true,
					checkStrictly: true
				}
			}
		},
		mounted() {

		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//值变化
			change(val){
				// this.$message('change事件，返回详情查看控制台')
				this.form.role = val.id
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						let {username,realname,status,password,mobile,role,id} = this.form
						let res;
						if(this.mode == 'add'){
							 res = await this.$API.system.user.edit.post({username,realname,status,password,mobile,role});
						}else{
							 res = await this.$API.system.user.edit.post({id,username,realname,status,password,mobile,role});
						}
						this.isSaveing = false;
						if(res.code === 0){
							this.$emit('reloadData')
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.id = data.id
				this.form.realname = data.realname
				this.form.avatar = data.avatar
				this.form.username = data.username
				this.form.status = data.status === 1?true : false
				this.form.mobile = data.mobile
				this.form.role = data.role
				this.form.role_name = data.role_name

				console.log(this.form)
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
