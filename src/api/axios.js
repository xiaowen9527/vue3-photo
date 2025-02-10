import axios from 'axios';
import qs from 'qs'

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VUE_APP_BASE_API, // 域名配置，可添加变量配置文件定义
    withCredentials: true, // 跨域请求时是否需要使用凭证
    timeout: 30000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = localStorage.getItem("token") || '';

        // post改变 Content-Type 的值 ， 序列化请求参数
        if (config.method?.toUpperCase() === 'POST') {

            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            config.data = qs.stringify(config.data)
        } else {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        return Promise.reject(err.response);
    }
);

export default service;