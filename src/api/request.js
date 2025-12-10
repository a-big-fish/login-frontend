import axios from "axios"
import store from '@/store'
import { Message } from 'element-ui'

const service = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 5000,
    headers: {
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"http://localhost:8123"
    },
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 添加token,loading等
        // 从store获取token
        const token = store.state.user.token || localStorage.getItem("token")
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error =>{
        return Promise.reject(error);
    }
)
// 响应拦截器
service.interceptors.response.use(
    response =>{
        const res = response.data;
        // 后端返回统一格式 {data: {}, message: "", code: 200}
        if(res.code == 200){
            return res.data;
        } else{
            Message.error(res.message || '请求失败');
            console.log(res);
            return Promise.reject(new Error(res.message || 'Error'));
        }
    },
    error => {
        // 处理各种错误情况
        if(error.response){
            switch(error.response.status){
                case 401:
                    // token失效
                    Message.error("登录已过期，请重新登录");
                    store.dispatch("logout")
                    break;
                case 403:
                    // 无权限
                    Message.error("没有权限访问");
                    break;
                case 404:
                    // 请求的资源不存在
                    Message.error("请求的资源不存在");
                    break;
                case 500:
                    // 服务器内部错误
                    Message.error("服务器内部错误");
                    break;
                default:
                    Message.error(error.response.data.message || "未知错误");
            }
        }else{
            Message.error("网络错误，请检查网络连接");
        }
        return Promise.reject(error)
    }
)
export default service