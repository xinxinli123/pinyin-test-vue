<template>
  <div class="stats-panel" :class="{ show }">
    <div class="stats-header">
      <h3>成长中心</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>

    <section class="week-hero">
      <div>
        <span>本周陪学</span>
        <strong>{{ weeklyInsights.activeDays }} 天</strong>
      </div>
      <div>
        <span>完成题数</span>
        <strong>{{ weeklyInsights.totalCount }}</strong>
      </div>
      <div>
        <span>本周正确率</span>
        <strong>{{ weeklyInsights.accuracy }}%</strong>
      </div>
      <button @click="$emit('copy-weekly-report')">复制周报</button>
    </section>

    <section class="insight-card">
      <span>本周洞察</span>
      <h4>{{ weeklyHeadline }}</h4>
      <p>{{ weeklyMessage }}</p>
    </section>

    <section class="stats-content">
      <div class="stats-item">
        <span class="label">总练习次数</span>
        <span class="value">{{ totalPracticeCount }}</span>
      </div>
      <div class="stats-item">
        <span class="label">累计正确率</span>
        <span class="value">{{ correctPercentage }}%</span>
      </div>
      <div class="stats-item">
        <span class="label">错题数量</span>
        <span class="value">{{ wrongCount }}</span>
      </div>
      <div class="stats-item">
        <span class="label">今日练习</span>
        <span class="value">{{ todayPracticeCount }}</span>
      </div>
    </section>

    <section class="map-summary">
      <div class="summary-heading">
        <span>能力地图摘要</span>
        <small>到期复习 {{ dueReviewCount }} 题</small>
      </div>
      <div class="summary-grid">
        <article v-for="item in learningMapSummary" :key="item.category">
          <strong>{{ item.title }}</strong>
          <span>掌握 {{ item.mastered }}</span>
          <small>待复习 {{ item.due }} · 已接触 {{ item.seen }}</small>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'StatsPanel',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    totalPracticeCount: {
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
    todayPracticeCount: {
      type: Number,
      required: true
    },
    weeklyInsights: {
      type: Object,
      required: true
    },
    learningMapSummary: {
      type: Array,
      required: true
    },
    dueReviewCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    weeklyHeadline() {
      if (this.weeklyInsights.totalCount === 0) return '本周还没开始，先完成第一小轮。'
      if (this.weeklyInsights.fastest?.mastered > 0) return `${this.weeklyInsights.fastest.title}进步最明显。`
      return '这一周正在建立第一批熟悉感。'
    },
    weeklyMessage() {
      if (this.weeklyInsights.totalCount === 0) {
        return '今天先完成一小轮，成长中心就会开始记录真正属于孩子自己的轨迹。'
      }
      if (this.weeklyInsights.repeatedMistakes.length > 0) {
        return `反复卡住的内容有：${this.weeklyInsights.repeatedMistakes.join('、')}。下周建议先短短复习，再继续新内容。`
      }
      if (this.weeklyInsights.needsAttention?.due > 0) {
        return `${this.weeklyInsights.needsAttention.title}已经有内容到期复习，先巩固会比继续冲新题更稳。`
      }
      return '本周节奏不错，暂时没有明显反复卡点，可以继续保持短时高质量。'
    }
  }
}
</script>

<style scoped>
.week-hero {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 10px;
  margin-bottom: 14px;
}

.week-hero div,
.insight-card,
.map-summary {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
}

.week-hero div {
  min-height: 74px;
  padding: 12px;
}

.week-hero span,
.week-hero strong {
  display: block;
}

.week-hero span {
  color: var(--text-light);
  font-size: 13px;
}

.week-hero strong {
  margin-top: 8px;
  color: var(--text-color);
  font-size: 22px;
}

.week-hero button {
  min-height: 48px;
  align-self: stretch;
  border: 0;
  border-radius: 10px;
  padding: 0 14px;
  background: var(--primary-color);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.insight-card {
  margin-bottom: 14px;
  padding: 16px;
}

.insight-card span {
  color: var(--primary-color);
  font-weight: 900;
}

.insight-card h4 {
  margin: 8px 0;
  color: var(--text-color);
  font-size: 20px;
}

.insight-card p {
  margin: 0;
  color: var(--text-light);
  line-height: 1.65;
}

.stats-content {
  margin-bottom: 14px;
}

.map-summary {
  padding: 16px;
}

.summary-heading {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.summary-heading span {
  color: var(--text-color);
  font-weight: 900;
}

.summary-heading small {
  color: var(--text-light);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.summary-grid article {
  border-radius: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.62);
}

.summary-grid strong,
.summary-grid span,
.summary-grid small {
  display: block;
}

.summary-grid strong {
  color: var(--text-color);
}

.summary-grid span {
  margin-top: 8px;
  color: var(--primary-color);
  font-weight: 900;
}

.summary-grid small {
  margin-top: 5px;
  color: var(--text-light);
}

@media (max-width: 620px) {
  .week-hero,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
