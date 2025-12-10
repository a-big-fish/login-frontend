import request from "./request"
import PasswordUtils from "@/utils/passwordUtils"

// 注册
export function register(data) {
    let {username,password,email,phone} = data
    // 前端hash为了不在网络上明文传输
    let hashPassword = PasswordUtils.hash(password)
    // 存储密码哈希
    password = hashPassword
    return request({
        url: '/user/register',
        method: 'post',
        data: {
            username: username,
            passwordHash: password,
            email: email,
            phone: phone
        }
    })
}

