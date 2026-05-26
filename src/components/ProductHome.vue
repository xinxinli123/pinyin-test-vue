<template>
  <main class="product-home">
    <section class="home-hero">
      <div class="hero-copy">
        <span class="eyebrow">3-7岁亲子陪学</span>
        <h1>{{ displayChildName }}的学习之路</h1>
        <p>每天几分钟，家长有方法，孩子有兴趣。用读、看、猜、说，把拼音、数字、成语和动物认知变成一段轻松的亲子时间。</p>
        <div class="child-profile">
          <label for="childName">孩子昵称</label>
          <input
            id="childName"
            v-model="nameDraft"
            maxlength="10"
            @change="commitChildName"
            @keyup.enter="commitChildName"
            @blur="commitChildName"
          >
        </div>
        <div class="hero-actions">
          <button class="primary-action" @click="$emit('start', recommendedType)">{{ primaryActionText }}</button>
          <button class="ghost-action" @click="$emit('review')" :disabled="wrongCount === 0">
            错题小复习
            <span v-if="wrongCount > 0">{{ wrongCount }}</span>
          </button>
          <button class="ghost-action" @click="$emit('restart-onboarding')">重新轻诊断</button>
        </div>
        <div class="stage-selector" aria-label="选择孩子年龄阶段">
          <button
            v-for="stage in stageOptions"
            :key="stage.value"
            :class="{ active: childStage === stage.value }"
            @click="$emit('change-stage', stage.value)"
          >
            <strong>{{ stage.label }}</strong>
            <span>{{ stage.note }}</span>
          </button>
        </div>
        <div class="pace-selector" aria-label="选择今日陪学节奏">
          <button
            v-for="pace in paceOptions"
            :key="pace.value"
            :class="{ active: sessionPace === pace.value }"
            @click="$emit('change-pace', pace.value)"
          >
            {{ pace.label }}
          </button>
        </div>
      </div>
      <div class="hero-board" aria-label="今日学习概览">
        <div class="board-card large">
          <span>今日练习</span>
          <strong>{{ todayPracticeCount }}</strong>
          <small>次</small>
        </div>
        <div class="board-card">
          <span>正确率</span>
          <strong>{{ correctPercentage }}%</strong>
        </div>
        <div class="board-card accent">
          <span>错题</span>
          <strong>{{ wrongCount }}</strong>
        </div>
        <div class="goal-card">
          <div>
            <span>今日目标</span>
            <strong>{{ goalText }}</strong>
          </div>
          <div class="goal-track">
            <i :style="{ width: goalProgress }"></i>
          </div>
        </div>
      </div>
    </section>

    <section class="next-step-panel">
      <div class="next-step-copy">
        <span class="section-kicker">智能下一步</span>
        <h2>{{ nextStep.title }}</h2>
        <p>{{ nextStep.message }}</p>
      </div>
      <button class="next-step-action" @click="handleNextStep">{{ nextStep.actionText }}</button>
    </section>

    <section class="diagnosis-panel">
      <div>
        <span class="section-kicker">当前陪学方案</span>
        <h2>{{ diagnosisTitle }}</h2>
        <p>{{ diagnosisMessage }}</p>
      </div>
      <button @click="$emit('restart-onboarding')">调整方案</button>
    </section>

    <section class="install-panel">
      <div class="install-icon">桌</div>
      <div>
        <span class="section-kicker">手机桌面入口</span>
        <h2>{{ installTitle }}</h2>
        <p>{{ installMessage }}</p>
      </div>
      <button class="install-action" @click="$emit('install-app')">{{ installActionText }}</button>
    </section>

    <section class="privacy-card">
      <div class="privacy-icon">本</div>
      <div>
        <span class="section-kicker">隐私与本机数据</span>
        <h2>当前记录保存在这台设备，家长可以随时导出或清理。</h2>
        <p>已记录 {{ localDataSummary.knowledgeCount }} 个知识点、{{ localDataSummary.recordDays }} 天学习轨迹、{{ localDataSummary.wrongCount }} 个错题。</p>
      </div>
      <button @click="$emit('show-privacy-center')">打开数据中心</button>
    </section>

    <section class="mission-panel" :data-theme="adventureTheme">
      <div class="mission-copy">
        <span class="section-kicker">今日冒险主题</span>
        <h2>{{ currentAdventure.title }}</h2>
        <p>{{ currentAdventure.message }}</p>
        <div class="mission-selector" aria-label="选择今日冒险主题">
          <button
            v-for="theme in adventureOptions"
            :key="theme.value"
            :class="{ active: adventureTheme === theme.value }"
            @click="$emit('change-adventure', theme.value)"
          >
            <strong>{{ theme.label }}</strong>
            <small>{{ theme.note }}</small>
          </button>
        </div>
      </div>
      <div class="coach-script-card">
        <span>家长三句话</span>
        <ol>
          <li v-for="line in coachScriptLines" :key="line">{{ line }}</li>
        </ol>
        <button @click="$emit('copy-coach-script', coachScriptText)">复制陪学话术</button>
      </div>
    </section>

    <section class="scene-panel">
      <div class="scene-copy">
        <span class="section-kicker">家庭场景模式</span>
        <h2>{{ currentScene.title }}</h2>
        <p>{{ currentScene.message }}</p>
      </div>
      <div class="scene-selector" aria-label="选择家庭陪学场景">
        <button
          v-for="scene in sceneOptions"
          :key="scene.value"
          :class="{ active: familyScene === scene.value }"
          @click="$emit('change-family-scene', scene.value)"
        >
          <strong>{{ scene.label }}</strong>
          <small>{{ scene.note }}</small>
        </button>
      </div>
      <button class="scene-start" @click="$emit('start', recommendedType)">{{ currentScene.actionText }}</button>
    </section>

    <section class="mood-panel" :data-mood="learningMood">
      <div class="mood-copy">
        <span class="section-kicker">孩子状态雷达</span>
        <h2>{{ currentMood.title }}</h2>
        <p>{{ currentMood.message }}</p>
      </div>
      <div class="mood-selector" aria-label="选择孩子今天学习状态">
        <button
          v-for="mood in moodOptions"
          :key="mood.value"
          :class="{ active: learningMood === mood.value }"
          @click="$emit('change-learning-mood', mood.value)"
        >
          <strong>{{ mood.label }}</strong>
          <small>{{ mood.note }}</small>
        </button>
      </div>
      <div class="mood-strategy">
        <span>今日策略</span>
        <strong>{{ currentMood.strategy }}</strong>
        <small>目标已调整为 {{ dailyGoalCount }} 题，提醒节奏也会跟着变轻。</small>
      </div>
    </section>

    <section class="daily-plan">
      <div>
        <span class="section-kicker">今天怎么陪</span>
        <h2>{{ stagePlanHeadline }}</h2>
      </div>
      <div class="plan-steps">
        <div v-for="(step, index) in sceneSteps" :key="step">
          <b>{{ index + 1 }}</b>
          <span>{{ step }}</span>
        </div>
      </div>
    </section>

    <section class="daily-path">
      <div class="path-heading">
        <span class="section-kicker">今日陪学路线</span>
        <h2>{{ pathTitle }}</h2>
      </div>
      <div class="path-cards">
        <button
          v-for="step in dailyPath"
          :key="step.key"
          class="path-card"
          :disabled="isPathStepDisabled(step)"
          @click="handlePathStep(step)"
        >
          <span class="path-order">{{ step.order }}</span>
          <strong>{{ step.title }}</strong>
          <small>{{ step.note }}</small>
        </button>
      </div>
    </section>

    <learning-map
      :summary="learningMapSummary"
      :due-review-count="dueReviewCount"
      :due-review-preview="dueReviewPreview"
      @start-review="$emit('start-scheduled-review')"
      @start-category="$emit('start', $event)"
    />

    <section class="weekly-preview">
      <div>
        <span class="section-kicker">本周成长</span>
        <h2>{{ weeklyPreviewTitle }}</h2>
        <p>{{ weeklyPreviewMessage }}</p>
      </div>
      <button @click="$emit('show-stats')">查看成长中心</button>
    </section>

    <section class="growth-strip">
      <div>
        <span>今日小星星</span>
        <strong>{{ todayStarCount }}</strong>
      </div>
      <div>
        <span>连续陪学</span>
        <strong>{{ consecutiveLearningDays }} 天</strong>
      </div>
      <p>{{ growthMessage }}</p>
    </section>

    <section class="recap-panel">
      <div class="recap-main">
        <span class="section-kicker">今日复盘</span>
        <h2>{{ recapTitle }}</h2>
        <p>{{ recapMessage }}</p>
      </div>
      <div class="recap-side">
        <span>可以这样夸</span>
        <strong>{{ parentPhrase }}</strong>
        <small>{{ nextSuggestion }}</small>
      </div>
    </section>

    <section class="badge-section">
      <div class="badge-heading">
        <span class="section-kicker">成长徽章</span>
        <h2>把每天的小努力，攒成孩子看得见的成就。</h2>
      </div>
      <div class="badge-grid">
        <div
          v-for="badge in achievementBadges"
          :key="badge.key"
          class="badge-card"
          :class="{ unlocked: badge.unlocked }"
        >
          <span class="badge-mark">{{ badge.unlocked ? '已获得' : '待解锁' }}</span>
          <strong>{{ badge.title }}</strong>
          <small>{{ badge.description }}</small>
        </div>
      </div>
    </section>

    <section class="practice-grid">
      <button
        v-for="item in practiceItems"
        :key="item.type"
        class="practice-card"
        :data-category="item.type"
        @click="$emit('start', item.type)"
      >
        <span class="card-icon">{{ item.icon }}</span>
        <strong>{{ item.title }}</strong>
        <small>{{ item.subtitle }}</small>
      </button>
    </section>
  </main>
</template>

<script>
import LearningMap from '@/components/LearningMap.vue'

export default {
  name: 'ProductHome',
  components: {
    LearningMap
  },
  data() {
    return {
      nameDraft: this.childName
    }
  },
  props: {
    categories: {
      type: Object,
      required: true
    },
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
    totalPracticeCount: {
      type: Number,
      required: true
    },
    dailyGoalCount: {
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
    childStage: {
      type: String,
      required: true
    },
    childName: {
      type: String,
      required: true
    },
    sessionPace: {
      type: String,
      required: true
    },
    adventureTheme: {
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
    },
    learningMapSummary: {
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
    },
    weeklyInsights: {
      type: Object,
      required: true
    },
    onboardingProfile: {
      type: Object,
      default: null
    },
    localDataSummary: {
      type: Object,
      required: true
    },
    canInstallApp: {
      type: Boolean,
      default: false
    },
    isStandaloneApp: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    childName(value) {
      this.nameDraft = value
    }
  },
  computed: {
    displayChildName() {
      return this.childName || '宝贝'
    },
    diagnosisTitle() {
      if (this.onboardingProfile?.firstWeekPlan?.title) return this.onboardingProfile.firstWeekPlan.title
      if (this.childStage === '3-4') return '当前方案：先让孩子愿意看、愿意说。'
      if (this.childStage === '6-7') return '当前方案：从拼读慢慢过渡到表达。'
      return '当前方案：用短时稳定节奏启蒙拼音和数字。'
    },
    diagnosisMessage() {
      if (this.onboardingProfile?.firstWeekPlan?.message) return this.onboardingProfile.firstWeekPlan.message
      return '可以通过轻诊断重新生成第一周路线，系统会自动调整年龄阶段、节奏、场景和孩子状态。'
    },
    stageOptions() {
      return [
        {
          value: '3-4',
          label: '3-4岁',
          note: '看图开口'
        },
        {
          value: '5-6',
          label: '5-6岁',
          note: '拼音启蒙'
        },
        {
          value: '6-7',
          label: '6-7岁',
          note: '入学衔接'
        }
      ]
    },
    paceOptions() {
      return [
        {
          value: 'light',
          label: '轻松'
        },
        {
          value: 'normal',
          label: '标准'
        },
        {
          value: 'challenge',
          label: '挑战'
        }
      ]
    },
    adventureOptions() {
      return [
        {
          value: 'forest',
          label: '森林探险队',
          note: '找声音脚印',
          role: '森林探险队长',
          title: '今天去森林里找声音脚印。',
          message: '把每一道题都当成一个小脚印，孩子答对了就前进一步，答错了就留下标记，等会儿再回来发现一次。'
        },
        {
          value: 'space',
          label: '星星列车',
          note: '点亮一站',
          role: '星星列车长',
          title: '今天坐上星星列车，一题点亮一站。',
          message: '每完成一题就是列车到站，家长负责报站和鼓励，孩子负责听、读、说，慢慢点亮今日路线。'
        },
        {
          value: 'ocean',
          label: '海边寻宝',
          note: '收集小贝壳',
          role: '海边寻宝员',
          title: '今天去海边寻宝，把知识装进小贝壳。',
          message: '遇到不会的题不是失败，只是发现了一枚还没打开的贝壳。先收起来，稍后再一起打开看看。'
        }
      ]
    },
    currentAdventure() {
      return this.adventureOptions.find(theme => theme.value === this.adventureTheme) || this.adventureOptions[0]
    },
    sceneOptions() {
      return [
        {
          value: 'morning',
          label: '早晨热身',
          note: '3分钟开口',
          title: '早晨只做轻热身，让孩子带着成就感出门。',
          message: '适合起床后、上学前。目标不是练很多，而是让孩子愿意开口，完成一小轮就停。',
          actionText: '开始早晨热身',
          opening: '我们先用很短的一轮把声音叫醒。',
          correction: '读错先不急，早晨只要愿意开口就很好。',
          closing: '今天早晨已经启动成功，剩下的晚上再慢慢来。',
          steps: ['先听一遍', '孩子试着读', '夸一句就停']
        },
        {
          value: 'afterMeal',
          label: '饭后五分钟',
          note: '稳定做一轮',
          title: '饭后五分钟，刚好做一轮高质量陪学。',
          message: '适合每天固定时段。家长只需要坐在旁边轻声带读，让练习成为稳定的小仪式。',
          actionText: '开始饭后陪学',
          opening: '我们饭后玩五分钟，完成今天的小任务。',
          correction: '不会的题先放进错题本，等会儿再回来挑战。',
          closing: '完成后选一个喜欢的题讲给家人听。',
          steps: ['孩子先读', '家长轻声带读', '说一句生活例子']
        },
        {
          value: 'bedtime',
          label: '睡前收尾',
          note: '温柔不刺激',
          title: '睡前用温柔收尾，不把学习变成拉扯。',
          message: '适合睡前短练。减少纠错和竞争感，重点是复盘、鼓励和轻松结束。',
          actionText: '开始睡前收尾',
          opening: '我们用很轻的声音玩几题，完成就休息。',
          correction: '这题先做个小标记，明天白天再挑战。',
          closing: '最后选一题读给我听，然后今天就收工。',
          steps: ['声音放轻', '少纠错多鼓励', '选一题收尾']
        }
      ]
    },
    currentScene() {
      return this.sceneOptions.find(scene => scene.value === this.familyScene) || this.sceneOptions[1]
    },
    sceneSteps() {
      return this.currentScene.steps
    },
    moodOptions() {
      return [
        {
          value: 'curious',
          label: '想玩想试',
          note: '可多一点选择',
          title: '孩子今天状态在线，可以把练习做得更像游戏。',
          message: '给孩子更多选择权，比如让孩子选主题、选收尾题。目标会略微上调，但仍然保持短时高质量。',
          strategy: '让孩子当小老师，读完后反过来考家长一题。',
          goalNote: '孩子状态不错，可以多给一点选择权。',
          coachLine: '你可以当小老师，等下选一题来考我。',
          closing: '最后你来选今天最得意的一题。'
        },
        {
          value: 'tired',
          label: '有点累',
          note: '降一点目标',
          title: '孩子有点累，今天重点是轻轻完成，不硬撑。',
          message: '系统会自动降低今日目标，并更早提醒休息。家长少讲道理，多用“做一点也算完成”的反馈。',
          strategy: '先做最熟悉的题，完成一小步就及时收住。',
          goalNote: '孩子有点累，今天少做一点也算完成。',
          coachLine: '我们今天不拼速度，只轻轻完成一小步。',
          closing: '做完这一小轮就休息，明天再继续。'
        },
        {
          value: 'resistant',
          label: '有点抗拒',
          note: '先破冰',
          title: '孩子有点抗拒，今天先把“愿意开始”当成胜利。',
          message: '系统会把目标压到更小，优先推荐低压力内容。不要追正确率，先让孩子重新觉得学习不难开始。',
          strategy: '先承诺只做 3 题，孩子可以决定先听、先看还是先读。',
          goalNote: '孩子有点抗拒，今天先做少量破冰题。',
          coachLine: '你可以先听一遍，不想马上读也可以。',
          closing: '完成 3 题就算今天启动成功。'
        }
      ]
    },
    currentMood() {
      return this.moodOptions.find(mood => mood.value === this.learningMood) || this.moodOptions[0]
    },
    paceText() {
      const text = {
        light: '今天用轻松节奏，少做一点也算完成。',
        normal: '今天用标准节奏，保持一轮刚刚好。',
        challenge: '今天状态不错，可以多挑战几个。'
      }
      return `${text[this.sessionPace] || text.normal} ${this.currentMood.goalNote}`
    },
    stagePlan() {
      const plans = {
        '3-4': {
          recommendedType: 'dw',
          headline: '一轮 3-5 分钟，先让孩子愿意看、愿意说。'
        },
        '5-6': {
          recommendedType: 'py',
          headline: '一轮 5 分钟，听读结合，把声调慢慢念准。'
        },
        '6-7': {
          recommendedType: 'cy',
          headline: '一轮 8 分钟，读完再说意思，为入学表达做准备。'
        }
      }
      return plans[this.childStage] || plans['5-6']
    },
    stagePlanHeadline() {
      return `${this.currentScene.opening} ${this.stagePlan.headline} ${this.paceText}`
    },
    stageFocusText() {
      if (this.childStage === '3-4') return '愿意看、愿意指、愿意开口'
      if (this.childStage === '6-7') return '自己先读，再说出一点理解'
      return '听清声音，慢慢把声调念准'
    },
    coachScriptLines() {
      return [
        `${this.displayChildName}，今天你是${this.currentAdventure.role}，${this.currentScene.opening}`,
        `${this.currentScene.correction} ${this.currentMood.coachLine} 重点是${this.stageFocusText}。`,
        this.todayPracticeCount >= this.dailyGoalCount ? '今天任务已经完成，选一个最喜欢的题讲给家人听就收尾。' : `${this.currentScene.closing} ${this.currentMood.closing}`
      ]
    },
    coachScriptText() {
      return [
        `【${this.displayChildName}的今日陪学话术】`,
        `主题：${this.currentAdventure.label}`,
        `场景：${this.currentScene.label}`,
        `状态：${this.currentMood.label}`,
        ...this.coachScriptLines.map((line, index) => `${index + 1}. ${line}`)
      ].join('\n')
    },
    pathTitle() {
      if (this.childStage === '3-4') return '先看图，再开口，最后轻松收尾。'
      if (this.childStage === '6-7') return '从拼读到表达，像入学前的小热身。'
      return '热身、重点、复习，一轮刚刚好。'
    },
    nextStep() {
      if (this.learningMood === 'resistant' && this.todayPracticeCount === 0) {
        return {
          action: 'start',
          type: this.recommendedType,
          title: '先做一个超小破冰任务，只要开始就算赢。',
          message: '今天先不追正确率，也不追数量。让孩子先听一遍、看一眼、试一题，把“我不想学”变成“我可以试试”。',
          actionText: '先做 3 题破冰'
        }
      }
      if (this.learningMood === 'tired' && this.todayPracticeCount === 0) {
        return {
          action: 'start',
          type: this.recommendedType,
          title: '今天用低能量模式，轻轻做一小轮。',
          message: '孩子累的时候，产品会把目标变短。完成一点点也值得被看见，别让陪学变成硬撑。',
          actionText: '开始轻量练习'
        }
      }
      if (this.dueReviewCount > 0 && this.todayPracticeCount === 0) {
        return {
          action: 'scheduled-review',
          title: '今天先复习旧知识，再学新内容会更稳。',
          message: this.dueReviewPreview.length > 0
            ? `先把 ${this.dueReviewPreview.join('、')} 再见一面，孩子更容易把旧知识留住。`
            : '有一些旧知识刚好到了该再见一面的时间，先复习再继续新内容。',
          actionText: '开始今日复习包'
        }
      }
      if (this.todayPracticeCount >= this.dailyGoalCount) {
        return {
          action: 'copy-report',
          title: '今天已经完成目标，适合做一次温柔收尾。',
          message: '复制今日报告，给家人看一眼孩子今天的小成果，也给孩子一个被看见的瞬间。',
          actionText: '复制今日报告'
        }
      }
      if (this.wrongCount > 0 && this.childStage !== '3-4' && this.todayPracticeCount >= Math.ceil(this.dailyGoalCount / 2)) {
        return {
          action: 'review',
          title: '现在适合复习几道错题。',
          message: '已经热身过了，这时候短短复习错题，孩子更容易记住，也不会太累。',
          actionText: '进入错题复习'
        }
      }
      if (this.todayPracticeCount === 0) {
        return {
          action: 'start',
          type: this.recommendedType,
          title: '先从一小轮开始，不急着追求正确。',
          message: this.childStage === '3-4' ? '今天建议从看图说名字开始，让孩子先愿意开口。' : '今天建议按当前阶段推荐内容开始，家长先陪读一小会儿。',
          actionText: '开始推荐练习'
        }
      }
      return {
        action: 'start',
        type: this.recommendedType,
        title: '状态已经打开了，再完成一小步就好。',
        message: '继续当前推荐练习，保持节奏短一点、反馈及时一点。',
        actionText: '继续推荐练习'
      }
    },
    dailyPath() {
      const paths = {
        '3-4': [
          {
            key: 'warmup-dw',
            order: '1',
            type: 'dw',
            title: '看图说名字',
            note: '先让孩子描述画面，不急着纠正。'
          },
          {
            key: 'focus-sz',
            order: '2',
            type: 'sz',
            title: '数字小游戏',
            note: '读数字，再用手指数一数。'
          },
          {
            key: 'close-py',
            order: '3',
            type: 'py',
            title: '听一个声音',
            note: '跟读一小会儿，开心结束。'
          }
        ],
        '5-6': [
          {
            key: 'warmup-sz',
            order: '1',
            type: 'sz',
            title: '数字热身',
            note: '先用熟悉内容打开状态。'
          },
          {
            key: 'focus-py',
            order: '2',
            type: 'py',
            title: '拼音重点练',
            note: '听一遍，孩子读一遍。'
          },
          {
            key: 'review',
            order: '3',
            action: 'review',
            title: '错题小复习',
            note: this.wrongCount > 0 ? '只复习几题，记住就移出。' : '暂无错题，今天可以轻松收尾。'
          }
        ],
        '6-7': [
          {
            key: 'warmup-py',
            order: '1',
            type: 'py',
            title: '拼读热身',
            note: '让孩子自己拼，家长少提示。'
          },
          {
            key: 'focus-cy',
            order: '2',
            type: 'cy',
            title: '成语表达',
            note: '读完后说一句自己的话。'
          },
          {
            key: 'review',
            order: '3',
            action: 'review',
            title: '错题收尾',
            note: this.wrongCount > 0 ? '复习错题，形成闭环。' : '暂无错题，可以再玩一轮成语。'
          }
        ]
      }
      return paths[this.childStage] || paths['5-6']
    },
    goalText() {
      return `${Math.min(this.todayPracticeCount, this.dailyGoalCount)}/${this.dailyGoalCount}`
    },
    goalProgress() {
      if (this.dailyGoalCount <= 0) return '0%'
      return `${Math.min(100, Math.round((this.todayPracticeCount / this.dailyGoalCount) * 100))}%`
    },
    primaryActionText() {
      return this.todayPracticeCount >= this.dailyGoalCount ? '继续轻松玩一轮' : '开始今日陪练'
    },
    installTitle() {
      if (this.isStandaloneApp) return '已经像 App 一样打开了，适合每天固定陪学。'
      if (this.canInstallApp) return '添加到手机桌面，明天不用再找链接。'
      return '先把入口留住，适合发到手机或收藏。'
    },
    installMessage() {
      if (this.isStandaloneApp) return '孩子每天看见同一个入口，会更容易形成“短短一轮”的学习仪式感。'
      if (this.canInstallApp) return '家长点一下就能保存入口，睡前、饭后、通勤前都能快速开始一小轮。'
      return '不同浏览器的安装按钮位置不一样，这里会先复制链接，并提示从浏览器菜单添加到主屏幕。'
    },
    installActionText() {
      if (this.isStandaloneApp) return '已添加'
      return this.canInstallApp ? '添加到桌面' : '复制入口'
    },
    weeklyPreviewTitle() {
      if (this.weeklyInsights.totalCount === 0) return '本周还没开始，先留下第一枚脚印。'
      if (this.weeklyInsights.fastest?.mastered > 0) return `${this.weeklyInsights.fastest.title}正在变熟。`
      return `本周已经陪学 ${this.weeklyInsights.activeDays} 天。`
    },
    weeklyPreviewMessage() {
      if (this.weeklyInsights.totalCount === 0) return '完成第一小轮后，这里会开始告诉你孩子本周真正的变化。'
      if (this.weeklyInsights.repeatedMistakes.length > 0) {
        return `本周完成 ${this.weeklyInsights.totalCount} 题，当前最值得短复习的是 ${this.weeklyInsights.repeatedMistakes.join('、')}。`
      }
      return `本周完成 ${this.weeklyInsights.totalCount} 题，正确率 ${this.weeklyInsights.accuracy}%，暂时没有明显反复卡点。`
    },
    growthMessage() {
      if (this.sessionPace === 'light') return '轻松节奏也值得记录，孩子愿意开始就是很好的进步。'
      if (this.todayStarCount >= 8) return '今天状态很好，收尾时可以让孩子选一个最喜欢的题读给家人听。'
      if (this.consecutiveLearningDays >= 3) return '连续陪学已经开始形成节奏了，保持短一点、开心一点。'
      return '点“会了”会获得小星星，让孩子看见自己的努力。'
    },
    recapTitle() {
      if (this.todayPracticeCount === 0) return '今天还没开始，先来一轮轻松热身。'
      if (this.todayPracticeCount >= this.dailyGoalCount) return '今日目标完成，可以收尾了。'
      return `还差 ${this.dailyGoalCount - this.todayPracticeCount} 题完成今日目标。`
    },
    recapMessage() {
      if (this.todayPracticeCount === 0) {
        if (this.childStage === '3-4') return '建议先从看图说名字开始，孩子愿意开口就是今天的好开始。'
        if (this.childStage === '6-7') return '建议先做拼读热身，再进入表达练习，节奏会更稳。'
        return '建议先用数字或拼音热身，家长轻声带读，不急着纠错。'
      }
      if (this.wrongCount > 0) return `今天有 ${this.wrongCount} 个错题，收尾前复习 2-3 个就够了。`
      if (this.todayStarCount >= 5) return '孩子今天已经有明显投入感，收尾时让孩子选一个题目读给你听。'
      return '今天已经开始进入状态，保持短时高质量，比一次练很多更重要。'
    },
    parentPhrase() {
      if (this.todayPracticeCount === 0) return '我们先玩一小会儿，读错也没关系。'
      if (this.wrongCount > 0) return '你刚才很认真，错题放这里，等下我们再挑战一次。'
      if (this.todayPracticeCount >= this.dailyGoalCount) return '今天这轮完成得很漂亮，可以休息啦。'
      return '你已经开始会自己读了，我们再来几个就收尾。'
    },
    nextSuggestion() {
      if (this.todayPracticeCount >= this.dailyGoalCount) return '建议回首页收尾，明天继续保持。'
      if (this.todayPracticeCount > 0 && this.todayPracticeCount % 5 === 0) return '下一步可以先休息半分钟，再决定是否继续。'
      if (this.wrongCount > 0 && this.childStage !== '3-4') return '下一步优先点“错题小复习”。'
      return '下一步按“今日陪学路线”继续一小步。'
    },
    achievementBadges() {
      return [
        {
          key: 'first-start',
          title: '开口小勇士',
          description: '今天完成 1 题就能获得。',
          unlocked: this.todayPracticeCount >= 1
        },
        {
          key: 'star-collector',
          title: '星星收集家',
          description: '今天拿到 5 颗小星星。',
          unlocked: this.todayStarCount >= 5
        },
        {
          key: 'goal-finisher',
          title: '今日小冠军',
          description: '完成今天的陪学目标。',
          unlocked: this.todayPracticeCount >= this.dailyGoalCount
        },
        {
          key: 'habit-builder',
          title: '坚持三天',
          description: '连续陪学 3 天。',
          unlocked: this.consecutiveLearningDays >= 3
        },
        {
          key: 'hundred-steps',
          title: '百题脚印',
          description: '累计完成 100 题。',
          unlocked: this.totalPracticeCount >= 100
        },
        {
          key: 'clean-review',
          title: '错题整理员',
          description: '今日完成目标且错题本清空。',
          unlocked: this.todayPracticeCount >= this.dailyGoalCount && this.wrongCount === 0
        }
      ]
    },
    recommendedType() {
      if (this.todayPracticeCount === 0) return this.stagePlan.recommendedType
      if (this.wrongCount > 0 && this.childStage !== '3-4') return 'py'
      return this.stagePlan.recommendedType
    },
    practiceItems() {
      return [
        {
          type: 'py',
          icon: 'a',
          title: this.categories.py.title,
          subtitle: '听一听，读一读，把声调念准。'
        },
        {
          type: 'sz',
          icon: '1',
          title: this.categories.sz.title,
          subtitle: '用手比一比，让数字进入生活。'
        },
        {
          type: 'dw',
          icon: '图',
          title: this.categories.dw.title,
          subtitle: '看图说名字，再跟读拼音。'
        },
        {
          type: 'cy',
          icon: '成',
          title: this.categories.cy.title,
          subtitle: '猜意思，讲一个小小故事。'
        }
      ]
    }
  },
  methods: {
    handleNextStep() {
      if (this.nextStep.action === 'review') {
        this.$emit('review')
        return
      }
      if (this.nextStep.action === 'scheduled-review') {
        this.$emit('start-scheduled-review')
        return
      }
      if (this.nextStep.action === 'copy-report') {
        this.$emit('copy-report')
        return
      }
      this.$emit('start', this.nextStep.type || this.recommendedType)
    },
    commitChildName() {
      const nextName = String(this.nameDraft || '').trim()
      if (nextName !== this.childName) {
        this.$emit('update-child-name', nextName)
      }
    },
    isPathStepDisabled(step) {
      return step.action === 'review' && this.wrongCount === 0
    },
    handlePathStep(step) {
      if (this.isPathStepDisabled(step)) return
      if (step.action === 'review') {
        this.$emit('review')
        return
      }
      this.$emit('start', step.type)
    }
  }
}
</script>

<style scoped>
.product-home {
  min-height: 100vh;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(255, 247, 214, 0.86), rgba(222, 245, 232, 0.9)),
    repeating-linear-gradient(90deg, rgba(36, 48, 40, 0.03) 0, rgba(36, 48, 40, 0.03) 1px, transparent 1px, transparent 24px);
  color: #243028;
  overflow-y: auto;
  box-sizing: border-box;
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 28px;
  align-items: stretch;
  max-width: 1120px;
  margin: 0 auto;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 360px;
}

.eyebrow,
.section-kicker {
  font-size: 14px;
  font-weight: 700;
  color: #347046;
}

.hero-copy h1 {
  margin: 14px 0 16px;
  font-size: clamp(40px, 7vw, 78px);
  line-height: 1.02;
  color: #17251c;
}

.hero-copy p {
  max-width: 680px;
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  color: #506356;
}

.child-profile {
  display: inline-grid;
  grid-template-columns: auto minmax(120px, 180px);
  gap: 10px;
  align-items: center;
  width: fit-content;
  margin-top: 20px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 10px 24px rgba(42, 61, 48, 0.08);
}

.child-profile label {
  color: #4f654f;
  font-weight: 900;
  font-size: 14px;
}

.child-profile input {
  min-width: 0;
  height: 34px;
  border: 1px solid rgba(31, 122, 74, 0.18);
  border-radius: 8px;
  padding: 0 10px;
  background: #ffffff;
  color: #17251c;
  font: inherit;
  font-weight: 800;
}

.child-profile input:focus {
  border-color: #1f7a4a;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(31, 122, 74, 0.12);
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.stage-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  max-width: 620px;
  margin-top: 22px;
}

.pace-selector {
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: min(360px, 100%);
  margin-top: 12px;
  padding: 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 10px 24px rgba(42, 61, 48, 0.08);
}

.pace-selector button {
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #536356;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.pace-selector button.active {
  background: #1f7a4a;
  color: #ffffff;
}

.stage-selector button {
  min-height: 76px;
  border: 1px solid rgba(31, 122, 74, 0.16);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.66);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.stage-selector button.active {
  border-color: #1f7a4a;
  background: #e8f7ec;
  box-shadow: 0 10px 22px rgba(31, 122, 74, 0.13);
}

.stage-selector strong,
.stage-selector span {
  display: block;
}

.stage-selector strong {
  font-size: 17px;
}

.stage-selector span {
  margin-top: 5px;
  color: #657267;
  font-size: 13px;
}

.primary-action,
.ghost-action,
.practice-card {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.primary-action,
.ghost-action {
  min-height: 48px;
  border-radius: 8px;
  padding: 0 22px;
  font-weight: 800;
}

.primary-action {
  background: #1f7a4a;
  color: white;
  box-shadow: 0 12px 26px rgba(31, 122, 74, 0.22);
}

.ghost-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.78);
  color: #243028;
}

.ghost-action:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ghost-action span {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ffcf5a;
}

.hero-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-content: center;
}

.board-card {
  min-height: 150px;
  border-radius: 8px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(42, 61, 48, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.board-card.large {
  grid-row: span 2;
}

.board-card.accent {
  background: #ffcf5a;
}

.goal-card {
  grid-column: 1 / -1;
  min-height: 86px;
  border-radius: 8px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(42, 61, 48, 0.12);
}

.goal-card > div:first-child {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.goal-card span {
  color: #5b6d60;
  font-weight: 800;
}

.goal-card strong {
  font-size: 26px;
  color: #17251c;
}

.goal-track {
  height: 10px;
  margin-top: 14px;
  border-radius: 999px;
  background: #dcebdd;
  overflow: hidden;
}

.goal-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #1f7a4a;
}

.board-card span,
.board-card small {
  color: #5b6d60;
  font-weight: 700;
}

.board-card strong {
  font-size: 64px;
  line-height: 1;
  color: #17251c;
}

.daily-plan,
.next-step-panel,
.diagnosis-panel,
.install-panel,
.privacy-card,
.mission-panel,
.scene-panel,
.mood-panel,
.weekly-preview,
.daily-path,
.growth-strip,
.recap-panel,
.badge-section,
.practice-grid {
  max-width: 1120px;
  margin: 22px auto 0;
}

.next-step-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px;
  border-radius: 8px;
  background: #e8f7ec;
  box-shadow: 0 14px 32px rgba(31, 122, 74, 0.12);
}

.next-step-copy h2 {
  margin: 8px 0 8px;
  font-size: 26px;
  line-height: 1.3;
}

.next-step-copy p {
  max-width: 760px;
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.next-step-action {
  min-height: 50px;
  border: 0;
  border-radius: 8px;
  padding: 0 22px;
  background: #1f7a4a;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 12px 26px rgba(31, 122, 74, 0.2);
}

.diagnosis-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(232, 247, 236, 0.82)),
    repeating-linear-gradient(90deg, rgba(31, 122, 74, 0.04) 0, rgba(31, 122, 74, 0.04) 1px, transparent 1px, transparent 18px);
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.diagnosis-panel h2 {
  margin: 8px 0 8px;
  font-size: 24px;
  line-height: 1.35;
}

.diagnosis-panel p {
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.diagnosis-panel button {
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

.install-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 22px;
  border: 1px solid rgba(31, 122, 74, 0.12);
  border-radius: 8px;
  background:
    radial-gradient(circle at 92% 18%, rgba(255, 207, 90, 0.26), transparent 28%),
    rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.install-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 8px;
  background: #1f7a4a;
  color: #ffffff;
  font-weight: 900;
}

.install-panel h2 {
  margin: 6px 0 6px;
  font-size: 22px;
  line-height: 1.35;
}

.install-panel p {
  margin: 0;
  color: #536356;
  line-height: 1.65;
}

.install-action {
  min-height: 46px;
  border: 0;
  border-radius: 8px;
  padding: 0 18px;
  background: #ffcf5a;
  color: #243028;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 10px 22px rgba(138, 91, 0, 0.13);
}

.privacy-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 22px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 92% 18%, rgba(223, 244, 246, 0.68), transparent 28%),
    rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.privacy-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 8px;
  background: #243028;
  color: #ffffff;
  font-weight: 900;
}

.privacy-card h2 {
  margin: 6px 0 6px;
  font-size: 22px;
  line-height: 1.35;
}

.privacy-card p {
  margin: 0;
  color: #536356;
  line-height: 1.65;
}

.privacy-card button {
  min-height: 46px;
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

.mission-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.44fr);
  gap: 16px;
  align-items: stretch;
  padding: 22px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 12% 12%, rgba(255, 207, 90, 0.32), transparent 26%),
    linear-gradient(135deg, #fff8dc, #e8f7ec);
  box-shadow: 0 14px 34px rgba(42, 61, 48, 0.1);
}

.mission-panel[data-theme="space"] {
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 207, 90, 0.28), transparent 22%),
    linear-gradient(135deg, #eaf2ff, #fff8dc);
}

.mission-panel[data-theme="ocean"] {
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.72), transparent 22%),
    linear-gradient(135deg, #dff4f6, #fff4df);
}

.mission-copy h2 {
  margin: 8px 0 10px;
  font-size: 28px;
  line-height: 1.25;
}

.mission-copy p {
  max-width: 740px;
  margin: 0;
  color: #536356;
  line-height: 1.75;
}

.mission-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.mission-selector button {
  min-height: 74px;
  border: 1px solid rgba(31, 122, 74, 0.14);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.62);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.mission-selector button.active {
  border-color: #1f7a4a;
  background: #ffffff;
  box-shadow: 0 12px 26px rgba(31, 122, 74, 0.14);
}

.mission-selector strong,
.mission-selector small {
  display: block;
}

.mission-selector strong {
  font-size: 16px;
}

.mission-selector small {
  margin-top: 6px;
  color: #657267;
}

.coach-script-card {
  border-radius: 8px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: inset 0 0 0 1px rgba(36, 48, 40, 0.05);
}

.coach-script-card > span {
  display: block;
  color: #347046;
  font-weight: 900;
}

.coach-script-card ol {
  margin: 12px 0 16px;
  padding-left: 22px;
  color: #243028;
}

.coach-script-card li {
  margin: 8px 0;
  line-height: 1.65;
}

.coach-script-card button {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: #1f7a4a;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.scene-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.52fr) auto;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(255, 248, 220, 0.76)),
    repeating-linear-gradient(135deg, rgba(31, 122, 74, 0.045) 0, rgba(31, 122, 74, 0.045) 1px, transparent 1px, transparent 12px);
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.scene-copy h2 {
  margin: 8px 0 8px;
  font-size: 24px;
  line-height: 1.35;
}

.scene-copy p {
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.scene-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.scene-selector button {
  min-height: 72px;
  border: 1px solid rgba(31, 122, 74, 0.12);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.68);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.scene-selector button.active {
  border-color: #ffcf5a;
  background: #fff8dc;
  box-shadow: 0 10px 22px rgba(138, 91, 0, 0.12);
}

.scene-selector strong,
.scene-selector small {
  display: block;
}

.scene-selector strong {
  font-size: 15px;
}

.scene-selector small {
  margin-top: 6px;
  color: #657267;
  line-height: 1.35;
}

.scene-start {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 0 18px;
  background: #243028;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 12px 24px rgba(36, 48, 40, 0.16);
}

.mood-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.52fr) minmax(220px, 0.34fr);
  gap: 16px;
  align-items: stretch;
  padding: 20px 22px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 92% 18%, rgba(255, 207, 90, 0.28), transparent 28%),
    linear-gradient(135deg, rgba(232, 247, 236, 0.86), rgba(255, 255, 255, 0.78));
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.mood-panel[data-mood="tired"] {
  background:
    radial-gradient(circle at 92% 18%, rgba(223, 244, 246, 0.72), transparent 28%),
    linear-gradient(135deg, rgba(244, 250, 246, 0.9), rgba(255, 248, 220, 0.74));
}

.mood-panel[data-mood="resistant"] {
  background:
    radial-gradient(circle at 90% 18%, rgba(255, 226, 184, 0.72), transparent 28%),
    linear-gradient(135deg, rgba(255, 248, 220, 0.9), rgba(255, 255, 255, 0.76));
}

.mood-copy h2 {
  margin: 8px 0 8px;
  font-size: 24px;
  line-height: 1.35;
}

.mood-copy p {
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.mood-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.mood-selector button {
  min-height: 82px;
  border: 1px solid rgba(31, 122, 74, 0.12);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.mood-selector button.active {
  border-color: #1f7a4a;
  background: #ffffff;
  box-shadow: 0 10px 22px rgba(31, 122, 74, 0.12);
}

.mood-selector strong,
.mood-selector small,
.mood-strategy span,
.mood-strategy strong,
.mood-strategy small {
  display: block;
}

.mood-selector strong {
  font-size: 15px;
}

.mood-selector small {
  margin-top: 6px;
  color: #657267;
  line-height: 1.35;
}

.mood-strategy {
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 0 0 1px rgba(36, 48, 40, 0.05);
}

.mood-strategy span {
  color: #347046;
  font-weight: 900;
}

.mood-strategy strong {
  margin: 10px 0;
  color: #17251c;
  line-height: 1.55;
}

.mood-strategy small {
  color: #657267;
  line-height: 1.55;
}

.weekly-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-radius: 8px;
  background: #fff8dc;
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.08);
}

.weekly-preview h2 {
  margin: 8px 0 8px;
  font-size: 24px;
  line-height: 1.35;
}

.weekly-preview p {
  margin: 0;
  color: #536356;
  line-height: 1.7;
}

.weekly-preview button {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  padding: 0 18px;
  background: #243028;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  white-space: nowrap;
}

.daily-plan {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 22px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
}

.daily-plan h2 {
  margin: 8px 0 0;
  font-size: 24px;
  line-height: 1.35;
}

.plan-steps {
  display: grid;
  grid-template-columns: repeat(3, 118px);
  gap: 10px;
}

.plan-steps div {
  min-height: 84px;
  padding: 12px;
  border-radius: 8px;
  background: #f7fbf0;
}

.plan-steps b {
  display: block;
  font-size: 24px;
  color: #1f7a4a;
}

.plan-steps span {
  display: block;
  margin-top: 8px;
  font-weight: 700;
}

.daily-path {
  padding: 22px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.path-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 14px;
}

.path-heading h2 {
  max-width: 720px;
  margin: 0;
  font-size: 24px;
  line-height: 1.35;
  text-align: right;
}

.path-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.path-card {
  min-height: 150px;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  color: #243028;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 12px 28px rgba(42, 61, 48, 0.1);
  font: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.path-card:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(42, 61, 48, 0.15);
}

.path-card:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.path-order {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 18px;
  border-radius: 999px;
  background: #1f7a4a;
  color: #ffffff;
  font-weight: 900;
}

.path-card strong,
.path-card small {
  display: block;
}

.path-card strong {
  font-size: 20px;
  margin-bottom: 8px;
}

.path-card small {
  color: #627166;
  line-height: 1.6;
}

.growth-strip {
  display: grid;
  grid-template-columns: 180px 180px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

.growth-strip div,
.growth-strip p {
  margin: 0;
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 12px 28px rgba(42, 61, 48, 0.09);
}

.growth-strip span,
.growth-strip strong {
  display: block;
}

.growth-strip span {
  color: #647367;
  font-weight: 800;
}

.growth-strip strong {
  margin-top: 8px;
  font-size: 30px;
  color: #17251c;
}

.growth-strip p {
  display: flex;
  align-items: center;
  color: #536356;
  line-height: 1.7;
}

.recap-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.42fr);
  gap: 14px;
  align-items: stretch;
  padding: 22px;
  border-radius: 8px;
  background: #fff8dc;
  box-shadow: 0 12px 30px rgba(42, 61, 48, 0.1);
}

.recap-main h2 {
  margin: 8px 0 10px;
  font-size: 28px;
  line-height: 1.25;
}

.recap-main p {
  max-width: 720px;
  margin: 0;
  color: #536356;
  line-height: 1.75;
}

.recap-side {
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.recap-side span,
.recap-side strong,
.recap-side small {
  display: block;
}

.recap-side span {
  color: #7a6828;
  font-weight: 900;
}

.recap-side strong {
  margin: 10px 0;
  font-size: 20px;
  line-height: 1.45;
  color: #17251c;
}

.recap-side small {
  color: #657267;
  line-height: 1.6;
}

.badge-section {
  padding: 22px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.badge-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 14px;
}

.badge-heading h2 {
  max-width: 620px;
  margin: 0;
  font-size: 24px;
  line-height: 1.35;
  text-align: right;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.badge-card {
  min-height: 132px;
  border: 1px solid rgba(36, 48, 40, 0.08);
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.62);
  color: #243028;
}

.badge-card.unlocked {
  border-color: rgba(31, 122, 74, 0.28);
  background: #e8f7ec;
  box-shadow: 0 12px 28px rgba(31, 122, 74, 0.12);
}

.badge-mark,
.badge-card strong,
.badge-card small {
  display: block;
}

.badge-mark {
  width: fit-content;
  margin-bottom: 16px;
  border-radius: 999px;
  padding: 5px 9px;
  background: #edf2ea;
  color: #657267;
  font-size: 12px;
  font-weight: 900;
}

.badge-card.unlocked .badge-mark {
  background: #1f7a4a;
  color: #ffffff;
}

.badge-card strong {
  font-size: 20px;
  margin-bottom: 8px;
}

.badge-card small {
  color: #627166;
  line-height: 1.55;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  padding-bottom: 28px;
}

.practice-card {
  min-height: 180px;
  padding: 18px;
  border-radius: 8px;
  text-align: left;
  background: #ffffff;
  color: #243028;
  box-shadow: 0 12px 28px rgba(42, 61, 48, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.practice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(42, 61, 48, 0.15);
}

.card-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  border-radius: 8px;
  background: #e7f5ea;
  color: #1f7a4a;
  font-family: 'pinyin';
  font-size: 28px;
  font-weight: 900;
}

.practice-card[data-category="sz"] .card-icon {
  background: #fff1c2;
  color: #8a5b00;
}

.practice-card[data-category="dw"] .card-icon {
  background: #dff4f6;
  color: #17656d;
}

.practice-card[data-category="cy"] .card-icon {
  background: #ffe4d6;
  color: #8b3d22;
}

.practice-card strong,
.practice-card small {
  display: block;
}

.practice-card strong {
  font-size: 22px;
  margin-bottom: 10px;
}

.practice-card small {
  font-size: 14px;
  line-height: 1.6;
  color: #627166;
}

@media (max-width: 900px) {
  .home-hero,
  .next-step-panel,
  .diagnosis-panel,
  .daily-plan,
  .install-panel,
  .privacy-card,
  .mission-panel,
  .scene-panel,
  .mood-panel,
  .weekly-preview,
  .daily-path,
  .recap-panel,
  .badge-section,
  .growth-strip {
    grid-template-columns: 1fr;
  }

  .practice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .plan-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .path-heading {
    display: block;
  }

  .path-heading h2 {
    margin-top: 8px;
    text-align: left;
  }

  .path-cards,
  .badge-grid,
  .mission-selector,
  .scene-selector,
  .mood-selector {
    grid-template-columns: 1fr;
  }

  .badge-heading {
    display: block;
  }

  .badge-heading h2 {
    margin-top: 8px;
    text-align: left;
  }
}

@media (max-width: 560px) {
  .product-home {
    padding: 16px;
  }

  .hero-copy {
    min-height: auto;
  }

  .hero-copy h1 {
    font-size: 44px;
  }

  .hero-copy p {
    font-size: 16px;
    line-height: 1.65;
  }

  .child-profile {
    grid-template-columns: 1fr;
    width: 100%;
    box-sizing: border-box;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 22px;
  }

  .stage-selector {
    grid-template-columns: 1fr;
  }

  .pace-selector {
    width: 100%;
  }

  .primary-action,
  .ghost-action {
    width: 100%;
    justify-content: center;
  }

  .hero-board,
  .practice-grid,
  .plan-steps {
    grid-template-columns: 1fr;
  }

  .hero-board {
    gap: 10px;
  }

  .board-card {
    min-height: 110px;
  }

  .board-card strong {
    font-size: 46px;
  }

  .daily-plan {
    padding: 16px;
  }

  .next-step-panel {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .next-step-action {
    width: 100%;
  }

  .diagnosis-panel {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .diagnosis-panel button {
    width: 100%;
  }

  .install-panel {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .install-icon {
    width: 46px;
    height: 46px;
  }

  .install-action {
    width: 100%;
  }

  .privacy-card {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .privacy-icon {
    width: 46px;
    height: 46px;
  }

  .privacy-card button {
    width: 100%;
  }

  .scene-panel {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .scene-start {
    width: 100%;
  }

  .mood-panel {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .weekly-preview {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .weekly-preview button {
    width: 100%;
  }

  .daily-path {
    padding: 16px;
  }

  .badge-section {
    padding: 16px;
  }

  .daily-plan h2,
  .next-step-copy h2 {
    font-size: 20px;
  }

  .path-heading h2,
  .badge-heading h2 {
    font-size: 20px;
  }

  .plan-steps div {
    min-height: auto;
  }

  .path-card {
    min-height: 126px;
  }

  .badge-card {
    min-height: 118px;
  }

  .recap-panel {
    padding: 16px;
  }

  .recap-main h2 {
    font-size: 22px;
  }

  .practice-card {
    min-height: 136px;
  }
}
</style>
