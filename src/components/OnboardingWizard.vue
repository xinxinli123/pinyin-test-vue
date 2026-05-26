<template>
  <div class="onboarding-overlay">
    <section class="onboarding-dialog">
      <div class="onboarding-head">
        <span>首次轻诊断</span>
        <button @click="$emit('skip')">稍后再说</button>
      </div>
      <h2>先用 1 分钟，给孩子生成一条更合适的陪学路线。</h2>
      <p>不用做测试，家长按直觉选择就好。系统会自动配置年龄阶段、今日节奏、家庭场景和第一周计划。</p>

      <div class="question-block">
        <label for="onboardingName">孩子怎么称呼？</label>
        <input id="onboardingName" v-model="draft.childName" maxlength="10">
      </div>

      <div class="choice-group">
        <span>孩子年龄阶段</span>
        <button
          v-for="option in ageOptions"
          :key="option.value"
          :class="{ active: draft.childStage === option.value }"
          @click="draft.childStage = option.value"
        >
          <strong>{{ option.label }}</strong>
          <small>{{ option.note }}</small>
        </button>
      </div>

      <div class="choice-group">
        <span>每天大概能陪多久？</span>
        <button
          v-for="option in timeOptions"
          :key="option.value"
          :class="{ active: draft.sessionPace === option.value }"
          @click="draft.sessionPace = option.value"
        >
          <strong>{{ option.label }}</strong>
          <small>{{ option.note }}</small>
        </button>
      </div>

      <div class="choice-group">
        <span>孩子今天更像哪种状态？</span>
        <button
          v-for="option in moodOptions"
          :key="option.value"
          :class="{ active: draft.learningMood === option.value }"
          @click="draft.learningMood = option.value"
        >
          <strong>{{ option.label }}</strong>
          <small>{{ option.note }}</small>
        </button>
      </div>

      <div class="choice-group">
        <span>家里最适合什么时候陪？</span>
        <button
          v-for="option in sceneOptions"
          :key="option.value"
          :class="{ active: draft.familyScene === option.value }"
          @click="draft.familyScene = option.value"
        >
          <strong>{{ option.label }}</strong>
          <small>{{ option.note }}</small>
        </button>
      </div>

      <div class="plan-preview">
        <span>生成的第一周路线</span>
        <strong>{{ firstWeekPlan.title }}</strong>
        <p>{{ firstWeekPlan.message }}</p>
      </div>

      <div class="onboarding-actions">
        <button class="secondary" @click="$emit('skip')">先自己探索</button>
        <button class="primary" @click="complete">生成陪学方案</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'OnboardingWizard',
  props: {
    childName: {
      type: String,
      required: true
    },
    childStage: {
      type: String,
      required: true
    },
    sessionPace: {
      type: String,
      required: true
    },
    familyScene: {
      type: String,
      required: true
    },
    learningMood: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      draft: {
        childName: this.childName,
        childStage: this.childStage,
        sessionPace: this.sessionPace,
        familyScene: this.familyScene,
        learningMood: this.learningMood
      }
    }
  },
  computed: {
    ageOptions() {
      return [
        { value: '3-4', label: '3-4岁', note: '先看图、愿意开口' },
        { value: '5-6', label: '5-6岁', note: '拼音和数字启蒙' },
        { value: '6-7', label: '6-7岁', note: '入学前表达衔接' }
      ]
    },
    timeOptions() {
      return [
        { value: 'light', label: '3分钟', note: '轻松破冰' },
        { value: 'normal', label: '5分钟', note: '稳定一轮' },
        { value: 'challenge', label: '8分钟', note: '状态好再挑战' }
      ]
    },
    moodOptions() {
      return [
        { value: 'curious', label: '想玩想试', note: '可以多给选择权' },
        { value: 'tired', label: '有点累', note: '目标自动变轻' },
        { value: 'resistant', label: '有点抗拒', note: '先做超小破冰' }
      ]
    },
    sceneOptions() {
      return [
        { value: 'morning', label: '早晨热身', note: '出门前开口' },
        { value: 'afterMeal', label: '饭后五分钟', note: '最适合固定习惯' },
        { value: 'bedtime', label: '睡前收尾', note: '温柔不刺激' }
      ]
    },
    firstWeekPlan() {
      const plans = {
        '3-4': {
          title: '第一周先建立“愿意开口”的安全感。',
          message: '建议从动物看图和数字小游戏开始，每次只做一小轮，家长少纠错、多描述。'
        },
        '5-6': {
          title: '第一周用拼音和数字建立稳定节奏。',
          message: '建议先数字热身，再进入拼音跟读；错题只短短复习，不把孩子卡太久。'
        },
        '6-7': {
          title: '第一周从拼读过渡到表达。',
          message: '建议先拼音热身，再加入成语表达，让孩子读完能说一句自己的话。'
        }
      }
      return plans[this.draft.childStage] || plans['5-6']
    }
  },
  methods: {
    complete() {
      this.$emit('complete', {
        ...this.draft,
        childName: String(this.draft.childName || '').trim() || '宝贝',
        adventureTheme: this.draft.childStage === '6-7' ? 'space' : this.draft.childStage === '3-4' ? 'ocean' : 'forest',
        firstWeekPlan: this.firstWeekPlan,
        completedAt: new Date().toISOString()
      })
    }
  }
}
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 2200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(22, 34, 26, 0.5);
  backdrop-filter: blur(10px);
}

.onboarding-dialog {
  width: min(760px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 14px;
  padding: 26px;
  background:
    radial-gradient(circle at 92% 12%, rgba(255, 207, 90, 0.28), transparent 28%),
    linear-gradient(135deg, #fff8dc, #e8f7ec);
  color: #17251c;
  box-shadow: 0 26px 74px rgba(15, 30, 20, 0.3);
}

.onboarding-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.onboarding-head span,
.choice-group > span,
.plan-preview span {
  color: #1f7a4a;
  font-weight: 900;
}

.onboarding-head button,
.onboarding-actions button {
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.onboarding-head button {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.72);
  color: #536356;
}

.onboarding-dialog h2 {
  margin: 14px 0 8px;
  font-size: 30px;
  line-height: 1.18;
}

.onboarding-dialog p {
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.question-block,
.choice-group,
.plan-preview {
  margin-top: 18px;
}

.question-block label {
  display: block;
  margin-bottom: 8px;
  color: #536356;
  font-weight: 900;
}

.question-block input {
  width: 100%;
  height: 44px;
  border: 1px solid rgba(31, 122, 74, 0.18);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 12px;
  background: #ffffff;
  color: #17251c;
  font: inherit;
  font-weight: 900;
}

.choice-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.choice-group > span {
  grid-column: 1 / -1;
}

.choice-group button {
  min-height: 82px;
  border: 1px solid rgba(31, 122, 74, 0.14);
  border-radius: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.66);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.choice-group button.active {
  border-color: #1f7a4a;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(31, 122, 74, 0.14);
}

.choice-group strong,
.choice-group small {
  display: block;
}

.choice-group small {
  margin-top: 6px;
  color: #657267;
  line-height: 1.4;
}

.plan-preview {
  border-radius: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.plan-preview strong {
  display: block;
  margin: 8px 0;
  font-size: 20px;
}

.onboarding-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.onboarding-actions button {
  min-height: 50px;
}

.onboarding-actions .secondary {
  background: #ffffff;
  color: #243028;
}

.onboarding-actions .primary {
  background: #1f7a4a;
  color: #ffffff;
}

@media (max-width: 640px) {
  .onboarding-dialog {
    padding: 20px;
  }

  .onboarding-dialog h2 {
    font-size: 24px;
  }

  .choice-group,
  .onboarding-actions {
    grid-template-columns: 1fr;
  }
}
</style>
