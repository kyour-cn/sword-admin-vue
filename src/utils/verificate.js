
//验证手机号
export function verifyPhone(rule, value, callback) {
	let reg = /^[1][3, 4, 5, 6, 7, 8, 9][0-9]{9}$/
	if(!reg.test(value)){
		return callback(new Error('请输入正确的手机号码'))
	}
	callback()
}

export function verifyMobile  (rule, value, callback){
	// 手机号正则表达式
	const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
	if (regMobile.test(value)) {
		// 合法的手机号
		return callback()
	}
	callback(new Error('请输入正确的手机号'))
}


//车牌号码
export function verifyCars(rule, value, callback) {
	let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
	if(!reg.test(value)){
		return callback(new Error('请输入正确的车牌号码'))
	}
	callback()
}
