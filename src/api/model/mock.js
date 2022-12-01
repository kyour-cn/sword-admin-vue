import config from "@/config"
import mockRequests from "@/mock/mockRequest/index.js"

export default {
    menu: {
        list: {
            url: `/getCompanylist`,
            name: "获取公司信息",
            get: async function () {
                return await mockRequests.get(this.url);
            }
        }
    }
}