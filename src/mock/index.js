import Mock from "mockjs";
import companyInfo from '@/mock/mockData/company-info'

console.log(companyInfo, "companyInfo");
let data = companyInfo;
Mock.mock('/mock/getCompanylist', 'get', (params) => {
    return {
        code: 0,
        data: data
    }
})

// Mock.mock('/mock/getCompanylist', { data: { code: 200 } })
