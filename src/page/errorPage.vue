<template>
  <div class="error-container">
    <div class="error-content">
      <!-- 错误图标 -->
      <div class="error-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
          <path d="M15 9L9 15" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 9L15 15" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 错误标题 -->
      <h1 class="error-title">{{ errorTitle }}</h1>

      <!-- 错误描述 -->
      <p class="error-description">
        {{ errorDescription }}
      </p>

      <!-- 倒计时 -->
      <div class="countdown-container">
        <p class="countdown-text">
          <span class="countdown-number">{{ countdown }}</span> 秒后将自动返回首页
        </p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
      </div>

      <!-- 立即返回按钮 -->
      <button class="home-button" @click="goHome">
        立即返回首页
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  data() {
    return {
      countdown: 5, // 倒计时秒数
      totalTime: 5, // 总时间，用于计算进度条
      timer: null, // 定时器
      defaultTitle: '该页面不存在或无权访问',
      defaultDescription: '抱歉，您访问的页面可能已被删除、更名或暂时不可用'
    }
  },
  computed: {
    // 计算进度条宽度
    progressWidth() {
      return (this.countdown / this.totalTime) * 100
    },
    errorTitle() {
      // 优先使用路由参数中的自定义消息，否则使用默认标题
      return this.$route.query.message || this.defaultTitle
    },
    errorDescription() {
      // 可以根据不同的错误类型显示不同的描述
      if (this.$route.query.type === 'permission') {
        return '您没有权限访问此页面，请联系管理员或返回首页'
      } else if (this.$route.query.type === 'not_found') {
        return '您访问的页面不存在，请检查网址是否正确'
      }
      return this.defaultDescription
    }
  },
  mounted() {
    // 开始倒计时
    this.startCountdown()
  },
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 开始倒计时
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          // 倒计时结束，跳转到首页
          this.goHome()
        }
      }, 1000)
    },

    // 返回首页
    goHome() {
      // 清理定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.$router.push('/')

      // // 如果有记录重定向路径，先尝试跳转回原页面
      // const redirectPath = this.$route.query.redirect
      
      // if (redirectPath && redirectPath !== '/') {
      //   this.$router.push(redirectPath)
      // } else {
      //   // 使用 Vue Router 跳转到首页
      //   this.$router.push('/')
      // }
    }
  }
}
</script>

<style scoped>
.error-container {
  min-height:  80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-content {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  margin-bottom: 30px;
  animation: shake 0.6s ease-in-out;
}

.error-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.countdown-container {
  margin-bottom: 30px;
}

.countdown-text {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
}

.countdown-number {
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
  animation: pulse 1s infinite;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4757, #ff6b7a);
  border-radius: 2px;
  transition: width 1s linear;
}

.home-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.home-button:active {
  transform: translateY(0);
}

/* 动画效果 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 40px 20px;
    margin: 20px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }
}
</style>