<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo/网站名称 -->
      <div class="nav-brand">
        <router-link to="/">My App</router-link>
      </div>

      <!-- 导航链接 -->
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      </div>

      <!-- 用户区域 -->
      <div class="nav-user">
        <!-- 未登录状态 -->
        <div v-if="!isLoggedIn" class="auth-buttons">
          <router-link to="/login" class="btn-login">登录</router-link>
          <router-link to="/register" class="btn-register">注册</router-link>
        </div>

        <!-- 已登录状态 -->
        <div v-else class="user-dropdown" @click="toggleDropdown">
          <div class="user-info">
            <img :src="user.avatar || defaultAvatar" :alt="user.name" class="user-avatar">
            <span class="username">{{ user.name }}</span>
            <i class="dropdown-icon">▼</i>
          </div>

          <!-- 下拉菜单 -->
          <div v-show="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item">
              <i>👤</i> 个人资料
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <i>⚙️</i> 设置
            </router-link>
            <div class="dropdown-divider"></div>
            <a @click="logout" class="dropdown-item logout">
              <i>🚪</i> 退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNav',
  data() {
    return {
      isLoggedIn: false,
      showDropdown: false,
      user: {
        name: '',
        avatar: ''
      },
      defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEREQiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0yMCAyMFYxOEMyMCA1LjIwOTEgMTUuNzkwOSA0IDEyIDRDOC4yMDkxNCA0IDQgNS4yMDkxIDQgMThWMjBIMjBaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
    }
  },
  mounted() {
    // 初始化用户状态
    this.$store.dispatch('initUser')
    // 监听登录状态变化
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_USER' || mutation.type === 'CLEAR_USER') {
        this.updateUserState()
      }
    })
    // 点击外部关闭下拉菜单
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    updateUserState() {
      this.isLoggedIn = this.$store.getters.isLoggedIn
      this.user = this.$store.getters.currentUser
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    handleClickOutside(event) {
      const userDropdown = this.$el.querySelector('.user-dropdown')
      if (userDropdown && !userDropdown.contains(event.target)) {
        this.showDropdown = false
      }
    },
    logout() {
      // 使用 Vuex 进行登出
      this.$store.dispatch('logout')
      this.showDropdown = false

      // 跳转到首页
      this.$router.push('/')

      // 显示提示信息
      this.$message?.success?.('已成功退出登录') || alert('已成功退出登录')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  height: 60px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand a {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #007bff;
}

.nav-user {
  display: flex;
  align-items: center;
}

/* 登录注册按钮 */
.auth-buttons {
  display: flex;
  gap: 15px;
}

.btn-login,
.btn-register {
  padding: 8px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-login {
  color: #007bff;
  border: 1px solid #007bff;
  background: transparent;
}

.btn-login:hover {
  background: #007bff;
  color: white;
}

.btn-register {
  color: white;
  background: #007bff;
  border: 1px solid #007bff;
}

.btn-register:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* 用户下拉菜单 */
.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #999;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
  margin-top: 5px;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.dropdown-divider {
  height: 1px;
  background-color: #e1e5e9;
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }

  .nav-links {
    gap: 20px;
  }

  .auth-buttons {
    gap: 10px;
  }

  .btn-login,
  .btn-register {
    padding: 6px 15px;
    font-size: 13px;
  }
}
</style>