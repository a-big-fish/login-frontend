// utils/password.js
import CryptoJS from "crypto-js"

/**
 * 密码工具类
 */
class PasswordUtils {
    /**
     * 简单哈希密码
     * @param {string} password - 原始密码
     * @returns {string} 哈希值
     */
    static hash(password) {
        if (!password || typeof password !== 'string') {
            throw new Error('密码必须是字符串')
        }
        return CryptoJS.SHA256(password).toString()
    }
    
    /**
     * 加盐哈希（前端盐主要用于增加复杂度，不是真正安全的盐）
     * @param {string} password - 原始密码
     * @param {string} salt - 盐值（可选，不传则生成随机盐）
     * @returns {Object} 包含哈希值和盐的对象
     */
    static hashWithSalt(password, salt = null) {
        // 如果没有提供盐，生成一个随机盐
        const useSalt = salt || this.generateSalt()
        // 加盐哈希
        const hash = CryptoJS.SHA256(password + useSalt).toString()
        return {
            hash,
            salt: useSalt,
            // 为了方便，也可以返回组合字符串（格式：hash:salt）
            combined: `${hash}:${useSalt}`
        }
    }
    /**
     * 生成随机盐
     * @param {number} length - 盐的长度（字节）
     * @returns {string} 十六进制盐值
     */
    static generateSalt(length = 16) {
        return CryptoJS.lib.WordArray.random(length).toString()
    }
    /**
     * 验证密码
     * @param {string} inputPassword - 输入的密码
     * @param {string} storedHash - 存储的哈希值
     * @param {string} salt - 盐值（可选）
     * @returns {boolean} 是否匹配
     */
    static verify(inputPassword, storedHash, salt = null) {
        if (salt) {
            // 如果有盐，使用相同的盐计算哈希
            const inputHash = CryptoJS.SHA256(inputPassword + salt).toString()
            return inputHash === storedHash
        } else {
            // 无盐，直接哈希比较
            const inputHash = this.hash(inputPassword)
            return inputHash === storedHash
        }
    }
    /**
     * 从组合字符串中提取哈希和盐
     * @param {string} combinedString - 格式为 "hash:salt" 的字符串
     * @returns {Object} 包含 hash 和 salt 的对象
     */
    static extractFromCombined(combinedString) {
        const [hash, salt] = combinedString.split(':')
        return { hash, salt }
    }
}

export default PasswordUtils