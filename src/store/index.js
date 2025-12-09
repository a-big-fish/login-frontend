import Vue from 'vue'
import Vuex from 'vuex'
import { login, getUserInfo } from '@/api/login'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    user: {
      id: null,
      name: '',
      avatar: '',
      token: null
    },
    // 登录状态
    isLoggedIn: false,
    // 全局加载状态
    loading: false,
    // 错误信息
    error: null
  },

  getters: {
    // 获取用户登录状态
    isLoggedIn: state => !!state.isLoggedIn,
    // 获取用户信息
    currentUser: state => state.user,
    // 获取加载状态
    isLoading: state => state.loading,
    // 获取错误信息
    getError: state => state.error,
    // 获取token
    getToken: state => state.user.token
  },

  mutations: {
    // 临时更改登录状态
    setIsLoggedIn(state, status){
      if(status == "true" || status == true){
        state.isLoggedIn = true;
        console.log("当前已登录");
        localStorage.setItem("isLoggedIn", true)
        // 还应该存储token等
        
      }else{
        state.isLoggedIn = false;
        localStorage.setItem("isLoggedIn", false)
      }
    },

    // 设置用户信息
    SET_USER(state, user) {
      state.user = { ...state.user, ...user }
      state.isLoggedIn = true
      // 保存到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(user))
      if (user.token) {
        localStorage.setItem('token', user.token)
      }
    },

    // 清除用户信息（登出）
    CLEAR_USER(state) {
      state.user = {
        id: null,
        name: '',
        avatar: '',
        token: null
      }
      state.isLoggedIn = false
      // 清除 localStorage
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
    },

    // 设置token
    SET_TOKEN(state, token) {
      state.user.token = token
      localStorage.setItem('token', token)
    },

    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    // 设置错误信息
    SET_ERROR(state, error) {
      state.error = error
    },

    // 清除错误信息
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    initializeStore({ commit }) {
      // 从 localStorage 中读取 isLoggedIn
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      commit("setIsLoggedIn", isLoggedIn)
    },
    tempInit({commit}, status){
      // 从 localStorage 中读取 isLoggedIn
      let isLoggedIn = status
      console.log("执行1");
      commit("setIsLoggedIn", isLoggedIn)
    },
    // -todo 登录操作
    async login({ commit }, loginForm) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        // 调用登录API
        const response = await login(loginForm)

        // 假设后端返回格式：{ code: 200, data: { token: 'xxx', user: {} }, message: '登录成功' }
        const { token, user } = response

        if (token) {
          commit('SET_TOKEN', token)

          // 如果有用户信息，一并保存
          if (user) {
            commit('SET_USER', { ...user, token })
          }

          // 设置登录状态
          localStorage.setItem('isLoggedIn', 'true')

          commit('SET_LOADING', false)
          return { token, user }
        } else {
          throw new Error('登录失败：未获取到token')
        }
      } catch (error) {
        commit('SET_ERROR', error.message || '登录失败')
        commit('SET_LOADING', false)
        throw error
      }
    },

    // 登出操作
    logout({ commit }) {
      commit('CLEAR_USER')
      commit('CLEAR_ERROR')
      // 跳转到登录页
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
    },

    // -todo 验证token有效性
    async validateToken({ commit, state }) {
      const token = state.user.token || localStorage.getItem('token')

      if (!token) {
        return false
      }

      try {
        // 调用后端验证token的接口
        const userInfo = await getUserInfo()

        // 更新用户信息
        commit('SET_USER', { ...userInfo, token })
        return true
      } catch (error) {
        // token无效或过期
        commit('CLEAR_USER')
        return false
      }
    },

    // -todo 初始化用户信息（从 localStorage 恢复）
    initUser({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const userInfo = localStorage.getItem('userInfo')
      const isLoggedIn = localStorage.getItem('isLoggedIn')

      if (token && isLoggedIn === 'true') {
        try {
          // 先设置token
          commit('SET_TOKEN', token)

          // 如果有用户信息
          if (userInfo) {
            const user = JSON.parse(userInfo)
            commit('SET_USER', user)
          }

          // 异步验证token有效性
          dispatch('validateToken').catch(() => {
            console.log('Token验证失败，需要重新登录')
          })
        } catch (error) {
          console.error('恢复用户信息失败:', error)
          commit('CLEAR_USER')
        }
      }
    },

    // 清除错误信息
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },

    init({ commit, dispatch }, status){
      commit('setIsLoggedIn', status)
    },
  }
})