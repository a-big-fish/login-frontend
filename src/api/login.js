import request from "./request"
import PasswordUtils from "@/utils/passwordUtils"

// 登录
export function login(data) {
    const username = data.username
    // 前端hash为了不在网络上明文传输
    const hashPassword = PasswordUtils.hash(data.password)
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username: username,
            passwordHash: hashPassword
        }
    })
}

// 登出
export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

// 鉴定token有效性
export function verifyToken() {
    return request({
        url: '/user/verify',
        method: 'get'
    })
}

// 刷新token
export function refreshToken() {
    return request({
        url: '/user/refresh',
        method: 'post'
    })
}

/**
 * @deprecated since version 2.0
 */
// 获取权限信息
export function fetchUserPermissions(){
    return request({
        url: '/user/permissions',
        method: 'post'
    })
}