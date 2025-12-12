import request from "./request"

// 修改用户
export function updateUser() {
    return request({
        url: '/user/update',
        method: 'post'
    })
}
