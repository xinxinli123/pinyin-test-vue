<template>
  <div class="parent-coach">
    <div class="coach-copy">
      <span class="coach-label">{{ label }}</span>
      <strong>{{ title }}</strong>
      <span>{{ tip }}</span>
    </div>
    <div class="coach-metrics">
      <div>
        <b>{{ todayPracticeCount }}</b>
        <span>今日</span>
      </div>
      <div>
        <b>{{ remainingCount }}</b>
        <span>剩余</span>
      </div>
      <div>
        <b>{{ wrongCount }}</b>
        <span>错题</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParentCoach',
  props: {
    categoryTitle: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    currentCategory: {
      type: String,
      required: true
    },
    childStage: {
      type: String,
      required: true
    },
    remainingCount: {
      type: Number,
      required: true
    },
    todayPracticeCount: {
      type: Number,
      required: true
    },
    wrongCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    label() {
      if (this.mode === 'wrongs') return '复习时间'
      if (this.mode === 'scheduled-review') return '今日复习包'
      return '亲子陪练'
    },
    title() {
      if (this.mode === 'wrongs') return '错题本小复盘'
      if (this.mode === 'scheduled-review') return '到期知识再见一面'
      return this.categoryTitle
    },
    tip() {
      if (this.mode === 'wrongs') {
        return '先让孩子自己试一次，记住了再移出错题本。'
      }
      if (this.mode === 'scheduled-review') {
        return '这不是新题，是旧知识回来打招呼，答对会把下次复习推远一点。'
      }
      if (this.childStage === '3-4') {
        const earlyTips = {
          py: '不用急着纠音，先让孩子愿意模仿声音。',
          cy: '听家长讲意思就好，让孩子说一个关键词。',
          sz: '边读边用手指数一数，像玩游戏一样。',
          dw: '先让孩子说看到了什么，再读名字。'
        }
        return earlyTips[this.currentCategory] || '短一点、开心一点，愿意开口就是进步。'
      }
      if (this.childStage === '6-7') {
        const schoolTips = {
          py: '读完后请孩子自己拼一遍，家长只提示一次。',
          cy: '让孩子用这个词说一句自己的话。',
          sz: '读完数字后，可以倒着读或跳着读。',
          dw: '说出动物名字后，再补一句它的特点。'
        }
        return schoolTips[this.currentCategory] || '让孩子多表达一点，比做很多题更重要。'
      }
      const tips = {
        py: '家长先听孩子读，再轻声带读一遍。',
        cy: '让孩子猜意思，家长讲一个小场景。',
        sz: '读完数字后，可以让孩子用手比一比。',
        dw: '先看图说名字，再跟读拼音。'
      }
      return tips[this.currentCategory] || '每次练 5 分钟，轻松一点更容易坚持。'
    }
  }
}
</script>

<style scoped>
.parent-coach {
  position: fixed;
  top: 18px;
  right: 20px;
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 18px;
  max-width: min(680px, calc(100vw - 160px));
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #243028;
}

.coach-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.coach-copy strong,
.coach-copy span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coach-label {
  font-size: 12px;
  color: #4f7d5a;
}

.coach-copy strong {
  font-size: 16px;
}

.coach-copy span:last-child {
  font-size: 13px;
  color: #66756a;
}

.coach-metrics {
  display: grid;
  grid-template-columns: repeat(3, 44px);
  gap: 8px;
  flex: 0 0 auto;
}

.coach-metrics div {
  text-align: center;
}

.coach-metrics b {
  display: block;
  font-size: 17px;
}

.coach-metrics span {
  display: block;
  font-size: 12px;
  color: #66756a;
}

@media (max-width: 768px) {
  .parent-coach {
    left: 10px;
    right: 10px;
    top: 62px;
    max-width: none;
    align-items: flex-start;
  }

  .coach-metrics {
    grid-template-columns: repeat(3, 38px);
  }
}
</style>
