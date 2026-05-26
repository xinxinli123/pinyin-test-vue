<template>
  <section class="learning-map">
    <div class="map-heading">
      <div>
        <span class="section-kicker">学习地图</span>
        <h2>家长不只看今天做了多少，还能看见孩子正在走到哪里。</h2>
      </div>
      <button class="review-action" :disabled="dueReviewCount === 0" @click="$emit('start-review')">
        {{ reviewActionText }}
      </button>
    </div>

    <div class="review-summary">
      <div>
        <span>今日复习包</span>
        <strong>{{ dueReviewCount }}</strong>
      </div>
      <p>{{ reviewSummaryText }}</p>
    </div>

    <div class="map-grid">
      <button
        v-for="item in summary"
        :key="item.category"
        class="map-card"
        @click="$emit('start-category', item.category)"
      >
        <span class="map-title">{{ item.title }}</span>
        <strong>{{ item.mastered }}</strong>
        <small>已掌握</small>
        <div class="map-track">
          <i :style="{ width: `${item.coverage}%` }"></i>
        </div>
        <div class="map-meta">
          <span>接触 {{ item.seen }}</span>
          <span>学习中 {{ item.learning }}</span>
          <span>待复习 {{ item.due }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LearningMap',
  props: {
    summary: {
      type: Array,
      required: true
    },
    dueReviewCount: {
      type: Number,
      required: true
    },
    dueReviewPreview: {
      type: Array,
      required: true
    }
  },
  computed: {
    reviewActionText() {
      return this.dueReviewCount > 0 ? `开始复习 ${this.dueReviewCount} 题` : '暂无到期复习'
    },
    reviewSummaryText() {
      if (this.dueReviewCount === 0) {
        return '今天还没有到期复习，适合继续探索新内容。'
      }
      if (this.dueReviewPreview.length === 0) {
        return '有一些旧知识到了该再见一面的时间。'
      }
      return `今天优先再见一面：${this.dueReviewPreview.join('、')}。`
    }
  }
}
</script>

<style scoped>
.learning-map {
  max-width: 1120px;
  margin: 22px auto 0;
  border-radius: 8px;
  padding: 22px;
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 207, 90, 0.24), transparent 24%),
    rgba(255, 255, 255, 0.68);
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.map-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.section-kicker {
  color: #347046;
  font-size: 14px;
  font-weight: 900;
}

.map-heading h2 {
  max-width: 680px;
  margin: 8px 0 0;
  font-size: 24px;
  line-height: 1.35;
}

.review-action {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 0 18px;
  background: #1f7a4a;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  white-space: nowrap;
}

.review-action:disabled {
  background: rgba(31, 122, 74, 0.18);
  color: #536356;
  cursor: not-allowed;
}

.review-summary {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  margin-top: 18px;
}

.review-summary div,
.review-summary p {
  margin: 0;
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
}

.review-summary span,
.review-summary strong {
  display: block;
}

.review-summary span {
  color: #657267;
  font-weight: 800;
}

.review-summary strong {
  margin-top: 8px;
  font-size: 32px;
}

.review-summary p {
  display: flex;
  align-items: center;
  color: #536356;
  line-height: 1.7;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.map-card {
  min-height: 170px;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  color: #243028;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 10px 24px rgba(42, 61, 48, 0.08);
  font: inherit;
}

.map-title,
.map-card strong,
.map-card small {
  display: block;
}

.map-title {
  color: #536356;
  font-weight: 900;
}

.map-card strong {
  margin-top: 14px;
  font-size: 34px;
}

.map-card small {
  color: #657267;
}

.map-track {
  height: 8px;
  margin: 16px 0 12px;
  border-radius: 999px;
  background: #edf2ea;
  overflow: hidden;
}

.map-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #1f7a4a;
}

.map-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.map-meta span {
  border-radius: 999px;
  padding: 4px 8px;
  background: #f7fbf0;
  color: #627166;
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .map-heading,
  .review-summary {
    display: grid;
    grid-template-columns: 1fr;
  }

  .map-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .learning-map {
    padding: 16px;
  }

  .map-heading h2 {
    font-size: 20px;
  }

  .review-action {
    width: 100%;
  }

  .map-grid {
    grid-template-columns: 1fr;
  }
}
</style>
