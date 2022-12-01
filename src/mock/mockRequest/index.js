import axios from "axios";


const mockRequests = axios.create({
    baseURL: "/mock",
    timeout: "3000"
})

//请求拦截器:将来项目中【N个请求】，只要发请求,会触发请求拦截器!!!
mockRequests.interceptors.request.use((config) => {
    return config
})

//响应拦截器：请求数据返回会执行
mockRequests.interceptors.response.use((res) => {
    return res.data
}, (err) => { })

//最后需要暴露:暴露的是添加新的功能的axios,即为requests
export default mockRequests