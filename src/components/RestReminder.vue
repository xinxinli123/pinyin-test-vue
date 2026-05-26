<template>
  <div class="rest-overlay">
    <section class="rest-dialog">
      <span class="rest-kicker">小休息时间</span>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="rest-tips">
        <span>眨眨眼</span>
        <span>喝口水</span>
        <span>看远处</span>
      </div>
      <div class="rest-actions">
        <button class="rest-now" @click="$emit('rest')">休息一下</button>
        <button class="keep-going" @click="$emit('continue')">继续这一轮</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'RestReminder',
  props: {
    childStage: {
      type: String,
      required: true
    },
    todayPracticeCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    title() {
      if (this.childStage === '3-4') return '已经很棒了，先让眼睛休息一下。'
      if (this.childStage === '6-7') return '练得不错，停一下会记得更牢。'
      return '这一小轮完成了，给孩子一个短暂停顿。'
    },
    message() {
      return `今天已经完成 ${this.todayPracticeCount} 题。休息半分钟，再决定要不要继续。`
    }
  }
}
</script>

<style scoped>
.rest-overlay {
  position: fixed;
  inset: 0;
  z-index: 1550;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(20, 33, 26, 0.42);
  backdrop-filter: blur(8px);
}

.rest-dialog {
  width: min(500px, 100%);
  border-radius: 8px;
  padding: 26px;
  background: #f5fbf2;
  box-shadow: 0 22px 62px rgba(15, 30, 20, 0.26);
  color: #17251c;
}

.rest-kicker {
  color: #1f7a4a;
  font-weight: 900;
}

.rest-dialog h2 {
  margin: 10px 0;
  font-size: 30px;
  line-height: 1.2;
}

.rest-dialog p {
  margin: 0;
  color: #536356;
  line-height: 1.75;
}

.rest-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 22px 0;
}

.rest-tips span {
  display: grid;
  place-items: center;
  min-height: 52px;
  border-radius: 8px;
  background: #ffffff;
  color: #243028;
  font-weight: 900;
}

.rest-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.rest-actions button {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.rest-now {
  background: #1f7a4a;
  color: #ffffff;
}

.keep-going {
  background: #ffffff;
  color: #243028;
}

@media (max-width: 520px) {
  .rest-dialog {
    padding: 20px;
  }

  .rest-dialog h2 {
    font-size: 25px;
  }

  .rest-tips,
  .rest-actions {
    grid-template-columns: 1fr;
  }
}
</style>
