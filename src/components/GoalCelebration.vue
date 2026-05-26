<template>
  <div class="goal-overlay">
    <section class="goal-dialog">
      <span class="goal-kicker">今日目标完成</span>
      <h2>今天可以漂亮收尾了</h2>
      <p>已经完成 {{ todayPracticeCount }} 题。{{ paceSummary }} 给 {{ displayChildName }} 一个拥抱，挑一句最喜欢的题再读一遍，就很完整。</p>
      <div class="goal-summary">
        <div>
          <b>{{ correctPercentage }}%</b>
          <span>正确率</span>
        </div>
        <div>
          <b>{{ wrongCount }}</b>
          <span>错题</span>
        </div>
        <div>
          <b>{{ streakCount }}</b>
          <span>连对</span>
        </div>
        <div>
          <b>{{ todayStarCount }}</b>
          <span>小星星</span>
        </div>
        <div>
          <b>{{ consecutiveLearningDays }}</b>
          <span>连续天数</span>
        </div>
      </div>
      <div class="goal-actions">
        <button class="report" @click="$emit('copy-report')">复制今日报告</button>
        <button class="finish" @click="$emit('finish')">回首页收尾</button>
        <button class="continue" @click="$emit('continue')">继续玩一轮</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'GoalCelebration',
  props: {
    todayPracticeCount: {
      type: Number,
      required: true
    },
    correctPercentage: {
      type: Number,
      required: true
    },
    wrongCount: {
      type: Number,
      required: true
    },
    streakCount: {
      type: Number,
      required: true
    },
    todayStarCount: {
      type: Number,
      required: true
    },
    consecutiveLearningDays: {
      type: Number,
      required: true
    },
    childName: {
      type: String,
      required: true
    },
    sessionPace: {
      type: String,
      required: true
    }
  },
  computed: {
    displayChildName() {
      return this.childName || '宝贝'
    },
    paceSummary() {
      const summaries = {
        light: '今天用轻松节奏也完成了，很适合收尾。',
        normal: '今天保持了一轮稳定陪学。',
        challenge: '今天挑战节奏完成得不错。'
      }
      return summaries[this.sessionPace] || summaries.normal
    }
  }
}
</script>

<style scoped>
.goal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(22, 34, 26, 0.48);
  backdrop-filter: blur(8px);
}

.goal-dialog {
  width: min(520px, 100%);
  border-radius: 8px;
  padding: 26px;
  background:
    linear-gradient(135deg, rgba(255, 248, 220, 0.96), rgba(229, 248, 234, 0.98)),
    #ffffff;
  box-shadow: 0 24px 70px rgba(15, 30, 20, 0.28);
  color: #17251c;
}

.goal-kicker {
  color: #1f7a4a;
  font-weight: 900;
}

.goal-dialog h2 {
  margin: 10px 0;
  font-size: 32px;
  line-height: 1.15;
}

.goal-dialog p {
  margin: 0;
  color: #536356;
  line-height: 1.75;
}

.goal-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
  gap: 10px;
  margin: 22px 0;
}

.goal-summary div {
  min-height: 82px;
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.75);
}

.goal-summary b,
.goal-summary span {
  display: block;
}

.goal-summary b {
  font-size: 28px;
}

.goal-summary span {
  color: #607066;
  font-weight: 700;
}

.goal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.goal-actions button {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.finish {
  background: #1f7a4a;
  color: #ffffff;
}

.report {
  background: #ffcf5a;
  color: #17251c;
}

.continue {
  background: #ffffff;
  color: #243028;
}

@media (max-width: 520px) {
  .goal-dialog {
    padding: 20px;
  }

  .goal-dialog h2 {
    font-size: 26px;
  }

  .goal-summary,
  .goal-actions {
    grid-template-columns: 1fr;
  }
}
</style>
