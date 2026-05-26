<template>
    <div id="app" :class="{ 'is-practicing': !showContainer }">
      <product-home
        v-if="showContainer"
        :categories="categories"
        :today-practice-count="todayPracticeCount"
        :correct-percentage="correctPercentage"
        :wrong-count="wrongs.data.length"
        :total-practice-count="totalPracticeCount"
        :daily-goal-count="dailyGoalCount"
        :today-star-count="todayStarCount"
        :consecutive-learning-days="consecutiveLearningDays"
        :child-stage="childStage"
        :child-name="childName"
        :session-pace="sessionPace"
        :adventure-theme="adventureTheme"
        :family-scene="familyScene"
        :learning-mood="learningMood"
        :learning-map-summary="learningMapSummary"
        :due-review-count="dueReviewCount"
        :due-review-preview="dueReviewPreview"
        :weekly-insights="weeklyInsights"
        :onboarding-profile="onboardingProfile"
        :local-data-summary="localDataSummary"
        :can-install-app="canInstallApp"
        :is-standalone-app="isStandaloneApp"
        @start="switchTask"
        @review="openWrongsFromHome"
        @change-stage="changeChildStage"
        @change-pace="changeSessionPace"
        @change-adventure="changeAdventureTheme"
        @change-family-scene="changeFamilyScene"
        @change-learning-mood="changeLearningMood"
        @update-child-name="updateChildName"
        @start-scheduled-review="startScheduledReview"
        @show-stats="showStats"
        @show-privacy-center="showPrivacyCenter"
        @restart-onboarding="restartOnboarding"
        @copy-report="copyDailyReport"
        @copy-coach-script="copyCoachScript"
        @install-app="installApp"
      />
    <div class="main"
         :data-category="currentCategory"
         @click="speakAgain" 
         v-longpress="showMenu" 
         v-if="!showContainer && currentData && currentCategory !== 'dw'">
      <span>{{ currentData.current }}</span>
    </div>
    
    <!-- 新增动物卡片显示 -->
    <div class="animal-card" v-else-if="!showContainer && currentData" @click="speakAgain" v-longpress="showMenu">
      <div class="animal-image-wrapper">
        <img 
          :src="currentData.current.image" 
          :alt="currentData.current.name"
          @load="handleImageLoad"
          @error="handleImageError"
          :class="{ 'image-loading': imageLoading }"
        >
        <div class="image-placeholder" v-if="imageLoading">
          <div class="loading-spinner"></div>
        </div>
      </div>
      <div class="animal-info">
        <div class="animal-name">{{ currentData.current.name }}</div>
        <div class="animal-pinyin">{{ currentData.current.pinyin }}</div>
      </div>
    </div>

    <!-- <div class="container"> -->
    <!-- 新增返回按钮 -->
     <!-- <button @click="showContainer = false" v-if="showContainer">返回</button> -->
    <!-- </div> -->
    <div class="desc" v-if="!showContainer && currentData">{{ practiceModeLabel }}剩余：{{ currentData.data.length }}</div>
    <div class="return" @click="showContainer = true" v-if="!showContainer">返回</div>

    <parent-coach
      v-if="!showContainer && currentData"
      :category-title="categories[currentCategory].title"
      :mode="mode"
      :current-category="currentCategory"
      :child-stage="childStage"
      :remaining-count="currentData.data.length"
      :today-practice-count="todayPracticeCount"
      :wrong-count="wrongs.data.length"
    />

    <practice-controls
      v-if="!showContainer && currentData && currentData.current"
      :current-category="currentCategory"
      :child-stage="childStage"
      :adventure-theme="adventureTheme"
      :family-scene="familyScene"
      :learning-mood="learningMood"
      @known="markKnown"
      @retry="markNeedsPractice"
      @speak-again="speakAgain"
      @menu="showMenu"
    />

    <goal-celebration
      v-if="showGoalCelebration"
      :today-practice-count="todayPracticeCount"
      :correct-percentage="correctPercentage"
      :wrong-count="wrongs.data.length"
      :streak-count="streakCount"
      :today-star-count="todayStarCount"
      :consecutive-learning-days="consecutiveLearningDays"
      :child-name="childName"
      :session-pace="sessionPace"
      @copy-report="copyDailyReport"
      @finish="finishDailyGoal"
      @continue="continueAfterGoal"
    />

    <rest-reminder
      v-if="showRestReminder"
      :child-stage="childStage"
      :today-practice-count="todayPracticeCount"
      @rest="restNow"
      @continue="continueAfterRest"
    />

    <menu-panel
      v-if="!showContainer && currentData"
      :show="showingMenu"
      :current-data="currentData"
      :mode="mode"
      :wrongs="wrongs"
      @close="showingMenu = false"
      @go-prev="goPrev"
      @add-wrongs="addWrongs"
      @open-wrongs="openWrongs"
      @remove-current-wrong="removeCurrentWrong"
      @clear-wrongs="clearWrongs"
      @exit-wrongs="exitWrongs"
      @show-settings="showSettings"
      @show-stats="showStats"
    />

    <!-- 进度条 -->
    <div class="progress-bar">
      <div v-if="!showContainer" class="progress-fill" :style="{ width: progressPercentage }"></div>
    </div>

    <!-- 装饰元素 -->
    <div class="decoration" v-if="!showContainer">
      <div class="decoration-circle" v-for="n in 3" :key="n"></div>
    </div>

    <!-- 反馈效果 -->
    <div class="feedback" v-if="showFeedback">
      {{ feedbackMessage }}
    </div>

    <settings-panel
      v-if="showSettingsPanel"
      :show="showSettingsPanel"
      :settings="settings"
      @close="showSettingsPanel = false"
      @save="saveSettings"
    />

    <stats-panel
      v-if="showStatsPanel"
      :show="showStatsPanel"
      :total-practice-count="totalPracticeCount"
      :correct-percentage="correctPercentage"
      :wrong-count="wrongs.data.length"
      :today-practice-count="todayPracticeCount"
      :weekly-insights="weeklyInsights"
      :learning-map-summary="learningMapSummary"
      :due-review-count="dueReviewCount"
      @copy-weekly-report="copyWeeklyReport"
      @close="showStatsPanel = false"
    />

    <onboarding-wizard
      v-if="showOnboarding"
      :child-name="childName"
      :child-stage="childStage"
      :session-pace="sessionPace"
      :family-scene="familyScene"
      :learning-mood="learningMood"
      @complete="completeOnboarding"
      @skip="skipOnboarding"
    />

    <data-privacy-panel
      v-if="showPrivacyPanel"
      :local-data-summary="localDataSummary"
      :privacy-note="privacyNote"
      @close="showPrivacyPanel = false"
      @export-data="exportLocalData"
      @copy-privacy-note="copyPrivacyNote"
      @reset-today="resetTodayData"
      @reset-all="resetAllLocalData"
    />

    <!-- 分享按钮 -->
    <div class="share-button" v-if="showContainer" @click="share">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 5.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.587A2.5 2.5 0 1 1 11 5.5zM3.5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      </svg>
      分享
    </div>

    <!-- 分享面板 -->
    <div class="share-panel" :class="{ show: showSharePanel }">
      <div class="share-header">
        <h3>分享给家长朋友</h3>
        <button class="close-btn" @click="showSharePanel = false">×</button>
      </div>
      <p class="share-intro">复制一段邀请文案，发给一起陪娃学习的朋友。</p>
      <div class="share-content">
        <button class="share-item primary-share" @click="copyShareText">
          <span>复制邀请文案</span>
          <small>包含简介和链接</small>
        </button>
        <button class="share-item" @click="copyDailyReport">
          <span>复制今日报告</span>
          <small>给家人看今天的陪学成果</small>
        </button>
        <button class="share-item" @click="copyLink">
          <span>只复制链接</span>
          <small>适合自己收藏</small>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import pyData from '@/assets/py-data.js' //拼音
import cyData from '@/assets/cy-data.js' //成语
import szData from '@/assets/sz-data.js' //数字
import dwData from '@/assets/dw-data.js' //动物
import ParentCoach from '@/components/ParentCoach.vue'
import PracticeControls from '@/components/PracticeControls.vue'
import ProductHome from '@/components/ProductHome.vue'


export default {
  components: {
    DataPrivacyPanel: () => import(/* webpackChunkName: "data-privacy-panel" */ '@/components/DataPrivacyPanel.vue'),
    GoalCelebration: () => import(/* webpackChunkName: "goal-celebration" */ '@/components/GoalCelebration.vue'),
    MenuPanel: () => import(/* webpackChunkName: "practice-menu" */ '@/components/MenuPanel.vue'),
    OnboardingWizard: () => import(/* webpackChunkName: "onboarding-wizard" */ '@/components/OnboardingWizard.vue'),
    ParentCoach,
    PracticeControls,
    ProductHome,
    RestReminder: () => import(/* webpackChunkName: "rest-reminder" */ '@/components/RestReminder.vue'),
    SettingsPanel: () => import(/* webpackChunkName: "settings-panel" */ '@/components/SettingsPanel.vue'),
    StatsPanel: () => import(/* webpackChunkName: "stats-panel" */ '@/components/StatsPanel.vue')
  },
  data () {
    return {
      showContainer:true,
      showRetrun:true,
      currentCategory: 'sz',
      categories: {
        py: { 
          type: 'pinyin', 
          title: '拼音练习', 
          current: '',
          prev: '',
          bakCurrent: '',
          data: [...pyData] 
        },
        cy: { 
          type: 'chengyu', 
          title: '成语练习', 
          current: '',
          prev: '',
          bakCurrent: '',
          data: [...cyData] 
        },
        sz: { 
          type: 'number', 
          title: '数字练习', 
          current: '',
          prev: '',
          bakCurrent: '',
          data: [...szData] 
        },
        dw: { 
          type: 'animal', 
          title: '动物练习', 
          current: '',
          prev: '',
          bakCurrent: '',
          data: [...dwData] 
        }
      },
      practicePools: {
        py: [],
        cy: [],
        sz: [],
        dw: []
      },
      currentData: null,
      wrongs: {
        current: '',
        prev: '',
        bakCurrent: '',
        data: JSON.parse(localStorage.getItem('wrongs') || '[]'),
        categories: {
          py: [],
          cy: [],
          sz: [],
          dw: []
        },
        reviewHistory: {},
        analysis: {
          total: 0,
          byCategory: {},
          byDifficulty: {},
          commonMistakes: []
        }
      },
      settings: {
        voice: {
          rate: 1.2,
          pitch: 1.5,
          preferredLang: 'zh-CN'
        },
        autoPlay: true,
        showPinyin: true
      },
      touchStartTime: 0,
      touchStartX: 0,
      touchStartY: 0,
      childName: localStorage.getItem('childName') || '小欣欣',
      sessionPace: localStorage.getItem('sessionPace') || 'normal',
      adventureTheme: localStorage.getItem('adventureTheme') || 'forest',
      familyScene: localStorage.getItem('familyScene') || 'afterMeal',
      learningMood: localStorage.getItem('learningMood') || 'curious',
      onboardingProfile: JSON.parse(localStorage.getItem('onboardingProfile') || 'null'),
      showOnboarding: localStorage.getItem('onboardingCompleted') !== 'true',
      knowledgeProgress: JSON.parse(localStorage.getItem('knowledgeProgress') || '{}'),
      showingMenu: false,
      mode: 'normal',
      imageLoading: true,
      showFeedback: false,
      feedbackMessage: '',
      showSettingsPanel: false,
      showStatsPanel: false,
      showPrivacyPanel: false,
      totalPracticeCount: 0,
      correctPercentage: 0,
      wrongPracticeCount: 0,
      streakCount: Number(localStorage.getItem('streakCount') || '0'),
      todayStarCount: Number(localStorage.getItem('todayStarCount') || '0'),
      starDate: localStorage.getItem('starDate') || '',
      consecutiveLearningDays: Number(localStorage.getItem('consecutiveLearningDays') || '0'),
      lastLearningDate: localStorage.getItem('lastLearningDate') || '',
      childStage: localStorage.getItem('childStage') || '5-6',
      showGoalCelebration: false,
      dailyGoalShownDate: localStorage.getItem('dailyGoalShownDate') || '',
      showRestReminder: false,
      restReminderShownKey: localStorage.getItem('restReminderShownKey') || '',
      deferredInstallPrompt: null,
      installPromptHandler: null,
      appInstalledHandler: null,
      isStandaloneApp: window.matchMedia?.('(display-mode: standalone)')?.matches || window.navigator.standalone === true,
      todayPracticeCount: 0,
      lastPracticeDate: null,
      showSharePanel: false,
      progressTotal: 0,
      soundUrls: {
        click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        success: 'https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3',
        error: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
        swipe: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'
      },
      soundCache: {},
      soundEnabled: true,
      touchEndX: 0,
      touchEndY: 0,
      minSwipeDistance: 50,
      learningStats: {
        startTime: null,
        totalTime: 0,
        dailyRecords: {},
        weeklyProgress: [],
        monthlyProgress: []
      },
      exportFormat: 'json',
      reviewReminder: {
        enabled: true,
        interval: 24, // 小时
        lastReview: null
      }
    }
  },
  computed: {
    isAnimalMode() {
      return this.currentCategory === 'dw';
    },
    
    isWrongMode() {
      return this.currentData?.type === 'wrong';
    },
    
    remainingCount() {
      return this.currentData?.data?.length || 0;
    },
    progressPercentage() {
      const total = this.progressTotal || 0;
      if (total <= 0) return '0%';
      const practiced = Math.max(0, total - this.remainingCount);
      const ratio = (practiced / total) * 100;
      return `${Math.max(0, Math.min(100, ratio))}%`;
    },
    currentLearningTime() {
      if (!this.learningStats.startTime) return 0;
      return Math.floor((Date.now() - this.learningStats.startTime) / 1000);
    },
    
    totalLearningTime() {
      return this.learningStats.totalTime + this.currentLearningTime;
    },
    
    formattedLearningTime() {
      const hours = Math.floor(this.totalLearningTime / 3600);
      const minutes = Math.floor((this.totalLearningTime % 3600) / 60);
      const seconds = this.totalLearningTime % 60;
      return `${hours}小时${minutes}分${seconds}秒`;
    },
    wrongsByCategory() {
      return this.wrongs.categories[this.currentCategory] || [];
    },
    
    needsReview() {
      if (!this.reviewReminder.enabled || !this.reviewReminder.lastReview) return false;
      const hoursSinceLastReview = (Date.now() - this.reviewReminder.lastReview) / (1000 * 60 * 60);
      return hoursSinceLastReview >= this.reviewReminder.interval;
    },
    
    reviewProgress() {
      const total = this.wrongs.data.length;
      const reviewed = Object.keys(this.wrongs.reviewHistory).length;
      return total > 0 ? Math.round((reviewed / total) * 100) : 0;
    },

    practiceModeLabel() {
      if (this.mode === 'wrongs') return '错题本复习，';
      if (this.mode === 'scheduled-review') return '今日复习包，';
      return '题库练习，';
    },

    dueReviewRecords() {
      const now = Date.now();
      return Object.values(this.knowledgeProgress)
        .filter(record => Number(record?.nextReviewAt || 0) <= now)
        .sort((a, b) => Number(a.nextReviewAt || 0) - Number(b.nextReviewAt || 0));
    },

    dueReviewItems() {
      return this.dueReviewRecords.slice(0, 12).map(record => record.item);
    },

    dueReviewCount() {
      return this.dueReviewRecords.length;
    },

    dueReviewPreview() {
      return this.dueReviewRecords
        .slice(0, 3)
        .map(record => record.label);
    },

    learningMapSummary() {
      const categoryOrder = ['py', 'sz', 'dw', 'cy'];
      const now = Date.now();
      return categoryOrder.map(category => {
        const records = Object.values(this.knowledgeProgress).filter(record => record.category === category);
        const mastered = records.filter(record => Number(record.mastery || 0) >= 3).length;
        const due = records.filter(record => Number(record.nextReviewAt || 0) <= now).length;
        const learning = Math.max(0, records.length - mastered);
        const total = this.categories[category].data.length;
        return {
          category,
          title: this.categories[category].title,
          total,
          seen: records.length,
          learning,
          due,
          mastered,
          coverage: total > 0 ? Math.round((records.length / total) * 100) : 0
        };
      });
    },

    weeklyRecords() {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return Object.entries(this.learningStats.dailyRecords)
        .filter(([date]) => new Date(`${date}T00:00:00`) >= start)
        .map(([date, record]) => ({ date, ...record }));
    },

    weeklyInsights() {
      const records = this.weeklyRecords;
      const activeDays = records.filter(record => Number(record.count || 0) > 0).length;
      const totalCount = records.reduce((sum, record) => sum + Number(record.count || 0), 0);
      const correctCount = records.reduce((sum, record) => sum + Number(record.correct || 0), 0);
      const wrongCount = records.reduce((sum, record) => sum + Number(record.wrong || 0), 0);
      const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
      const fastest = [...this.learningMapSummary].sort((a, b) => b.mastered - a.mastered || b.coverage - a.coverage)[0];
      const needsAttention = [...this.learningMapSummary].sort((a, b) => b.due - a.due || b.learning - a.learning)[0];
      const repeatedMistakes = Object.values(this.knowledgeProgress)
        .filter(record => Number(record.wrongCount || 0) > 0)
        .sort((a, b) => Number(b.wrongCount || 0) - Number(a.wrongCount || 0))
        .slice(0, 3)
        .map(record => record.label);
      return {
        activeDays,
        totalCount,
        correctCount,
        wrongCount,
        accuracy,
        fastest,
        needsAttention,
        repeatedMistakes
      };
    },

    localDataSummary() {
      return {
        childName: this.childName,
        totalPracticeCount: this.totalPracticeCount,
        todayPracticeCount: this.todayPracticeCount,
        wrongCount: this.wrongs.data.length,
        knowledgeCount: Object.keys(this.knowledgeProgress).length,
        recordDays: Object.keys(this.learningStats.dailyRecords || {}).length,
        onboardingCompleted: localStorage.getItem('onboardingCompleted') === 'true'
      };
    },

    privacyNote() {
      return '当前版本不会把孩子昵称、练习记录、错题、学习地图和周报上传到服务器；这些数据默认只保存在本机浏览器 localStorage 中。家长可以在数据中心导出备份，也可以随时清理今日数据或重置全部本机数据。';
    },

    dailyGoalCount() {
      const goals = {
        '3-4': 6,
        '5-6': 8,
        '6-7': 10
      };
      const paceOffset = {
        light: -2,
        normal: 0,
        challenge: 2
      };
      const baseGoal = (goals[this.childStage] || 8) + (paceOffset[this.sessionPace] || 0);
      if (this.learningMood === 'resistant') return Math.max(3, Math.min(5, baseGoal - 3));
      if (this.learningMood === 'tired') return Math.max(3, baseGoal - 2);
      return Math.max(3, baseGoal + 1);
    },

    restReminderInterval() {
      const intervals = {
        '3-4': 4,
        '5-6': 5,
        '6-7': 6
      };
      const paceOffset = {
        light: -1,
        normal: 0,
        challenge: 1
      };
      const moodOffset = {
        curious: 1,
        tired: -1,
        resistant: -2
      };
      return Math.max(3, (intervals[this.childStage] || 5) + (paceOffset[this.sessionPace] || 0) + (moodOffset[this.learningMood] || 0));
    },

    canInstallApp() {
      return Boolean(this.deferredInstallPrompt) && !this.isStandaloneApp;
    }
  },
  mounted () {
    this.resetPracticePool(this.currentCategory);
    this.currentData = {
      ...this.categories[this.currentCategory],
      data: this.practicePools[this.currentCategory]
    };
    this.progressTotal = this.currentData.data.length;
    
    window.addEventListener('beforeunload', this.saveProgress);
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchmove', this.preventZoom, { passive: false });
    this.installPromptHandler = event => {
      event.preventDefault();
      this.deferredInstallPrompt = event;
    };
    this.appInstalledHandler = () => {
      this.isStandaloneApp = true;
      this.deferredInstallPrompt = null;
      this.showFeedbackMessage('已添加到手机桌面，明天打开更方便');
    };
    window.addEventListener('beforeinstallprompt', this.installPromptHandler);
    window.addEventListener('appinstalled', this.appInstalledHandler);
    
    // 加载设置
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
    
    // 加载练习统计
    const stats = localStorage.getItem('practiceStats');
    if (stats) {
      const parsedStats = JSON.parse(stats);
      this.totalPracticeCount = parsedStats.totalPracticeCount || 0;
      this.wrongPracticeCount = parsedStats.wrongPracticeCount || 0;
      this.todayPracticeCount = parsedStats.todayPracticeCount || 0;
      this.lastPracticeDate = parsedStats.lastPracticeDate;
      this.updateCorrectPercentage();
    }
    this.normalizeDailyRewards();
    
    // 加载声音设置
    const soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled !== null) {
      this.soundEnabled = JSON.parse(soundEnabled);
    }
    
    // 加载学习记录
    const learningStats = localStorage.getItem('learningStats');
    if (learningStats) {
      this.learningStats = JSON.parse(learningStats);
    }
    
    // 加载复习提醒设置
    const reviewReminder = localStorage.getItem('reviewReminder');
    if (reviewReminder) {
      this.reviewReminder = JSON.parse(reviewReminder);
    }
    
    // 初始化错题分类
    this.initializeWrongsCategories();
    
    // 更新错题分析
    this.updateWrongsAnalysis();
    
    // 开始记录学习时间
    this.startLearning();
  },
  methods: {
    resetPracticePool(type) {
      this.practicePools[type] = [...this.categories[type].data];
    },

    saveKnowledgeProgress() {
      localStorage.setItem('knowledgeProgress', JSON.stringify(this.knowledgeProgress));
    },

    getKnowledgeLabel(item) {
      if (typeof item === 'object' && item?.name) return item.name;
      return String(item);
    },

    getKnowledgeKey(item, category) {
      return `${category}:${this.getKnowledgeLabel(item)}`;
    },

    recordKnowledgeProgress(isWrong) {
      const item = this.currentData?.current;
      if (!item) return;
      const category = this.getCategoryForItem(item) || this.currentCategory;
      if (!category) return;

      const key = this.getKnowledgeKey(item, category);
      const previous = this.knowledgeProgress[key] || {
        key,
        category,
        label: this.getKnowledgeLabel(item),
        item,
        attempts: 0,
        correctCount: 0,
        wrongCount: 0,
        streak: 0,
        mastery: 0,
        intervalDays: 0,
        lastSeen: null,
        nextReviewAt: null
      };
      const now = Date.now();
      const next = {
        ...previous,
        item,
        attempts: Number(previous.attempts || 0) + 1,
        lastSeen: now
      };

      if (isWrong) {
        next.wrongCount = Number(previous.wrongCount || 0) + 1;
        next.streak = 0;
        next.mastery = Math.max(0, Number(previous.mastery || 0) - 1);
        next.intervalDays = 0;
        next.nextReviewAt = now;
      } else {
        const intervalByMastery = [0, 1, 3, 7, 14];
        next.correctCount = Number(previous.correctCount || 0) + 1;
        next.streak = Number(previous.streak || 0) + 1;
        next.mastery = Math.min(4, Number(previous.mastery || 0) + 1);
        next.intervalDays = intervalByMastery[next.mastery];
        next.nextReviewAt = now + next.intervalDays * 24 * 60 * 60 * 1000;
      }

      this.$set(this.knowledgeProgress, key, next);
      this.saveKnowledgeProgress();
    },

    changeChildStage(stage) {
      this.childStage = stage;
      localStorage.setItem('childStage', stage);
      this.showFeedbackMessage('已切换陪学阶段');
    },

    changeSessionPace(pace) {
      this.sessionPace = pace;
      localStorage.setItem('sessionPace', pace);
      this.showFeedbackMessage('已切换今日节奏');
    },

    changeAdventureTheme(theme) {
      const allowedThemes = ['forest', 'space', 'ocean'];
      const nextTheme = allowedThemes.includes(theme) ? theme : 'forest';
      this.adventureTheme = nextTheme;
      localStorage.setItem('adventureTheme', nextTheme);
      this.showFeedbackMessage('已切换今日冒险主题');
    },

    changeFamilyScene(scene) {
      const allowedScenes = ['morning', 'afterMeal', 'bedtime'];
      const nextScene = allowedScenes.includes(scene) ? scene : 'afterMeal';
      this.familyScene = nextScene;
      localStorage.setItem('familyScene', nextScene);
      this.showFeedbackMessage('已切换家庭陪学场景');
    },

    changeLearningMood(mood) {
      const allowedMoods = ['curious', 'tired', 'resistant'];
      const nextMood = allowedMoods.includes(mood) ? mood : 'curious';
      this.learningMood = nextMood;
      localStorage.setItem('learningMood', nextMood);
      this.showFeedbackMessage('已根据孩子状态调整今日陪学策略');
    },

    restartOnboarding() {
      this.showOnboarding = true;
    },

    skipOnboarding() {
      localStorage.setItem('onboardingCompleted', 'true');
      this.showOnboarding = false;
    },

    completeOnboarding(profile) {
      this.childName = String(profile.childName || '').trim().slice(0, 10) || '宝贝';
      this.childStage = profile.childStage || '5-6';
      this.sessionPace = profile.sessionPace || 'normal';
      this.familyScene = profile.familyScene || 'afterMeal';
      this.learningMood = profile.learningMood || 'curious';
      this.adventureTheme = profile.adventureTheme || 'forest';
      this.onboardingProfile = profile;

      localStorage.setItem('childName', this.childName);
      localStorage.setItem('childStage', this.childStage);
      localStorage.setItem('sessionPace', this.sessionPace);
      localStorage.setItem('familyScene', this.familyScene);
      localStorage.setItem('learningMood', this.learningMood);
      localStorage.setItem('adventureTheme', this.adventureTheme);
      localStorage.setItem('onboardingProfile', JSON.stringify(profile));
      localStorage.setItem('onboardingCompleted', 'true');

      this.showOnboarding = false;
      this.showFeedbackMessage('已生成第一周陪学方案');
    },

    updateChildName(name) {
      const nextName = String(name || '').trim().slice(0, 10) || '宝贝';
      this.childName = nextName;
      localStorage.setItem('childName', nextName);
      this.showFeedbackMessage(`已更新为${nextName}的学习页`);
    },

    async installApp() {
      if (this.isStandaloneApp) {
        this.showFeedbackMessage('已经是桌面模式啦，直接陪学就好');
        return;
      }

      if (!this.deferredInstallPrompt) {
        await this.copyLink();
        this.showFeedbackMessage('链接已复制，手机浏览器菜单里可选择“添加到主屏幕”');
        return;
      }

      const promptEvent = this.deferredInstallPrompt;
      this.deferredInstallPrompt = null;
      promptEvent.prompt();

      try {
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          this.isStandaloneApp = true;
          this.playSound('success');
          this.showFeedbackMessage('已添加到桌面，陪学入口准备好了');
        } else {
          this.showFeedbackMessage('没关系，需要时还可以再添加到桌面');
        }
      } catch (error) {
        console.error('安装提示失败:', error);
        this.showFeedbackMessage('如果没有弹出安装，请从浏览器菜单添加到主屏幕');
      }
    },

    updateCorrectPercentage() {
      if (this.totalPracticeCount <= 0) {
        this.correctPercentage = 0;
        return;
      }
      const correctCount = Math.max(0, this.totalPracticeCount - this.wrongPracticeCount);
      this.correctPercentage = Number(((correctCount / this.totalPracticeCount) * 100).toFixed(1));
    },

    normalizeDailyRewards(today = new Date().toDateString()) {
      if (this.starDate !== today) {
        this.todayStarCount = 0;
        this.starDate = today;
        localStorage.setItem('todayStarCount', '0');
        localStorage.setItem('starDate', today);
      }
    },

    updateLearningDay(today = new Date().toDateString()) {
      if (this.lastLearningDate === today) return;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toDateString();
      this.consecutiveLearningDays = this.lastLearningDate === yesterdayKey
        ? this.consecutiveLearningDays + 1
        : 1;
      this.lastLearningDate = today;
      localStorage.setItem('consecutiveLearningDays', String(this.consecutiveLearningDays));
      localStorage.setItem('lastLearningDate', today);
    },

    rewardKnownAnswer() {
      const bonus = this.streakCount > 0 && this.streakCount % 5 === 0 ? 2 : 1;
      this.todayStarCount += bonus;
      localStorage.setItem('todayStarCount', String(this.todayStarCount));
      localStorage.setItem('starDate', this.starDate || new Date().toDateString());
    },

    // 语音合成相关
    initSpeech(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      Object.assign(utterance, this.settings.voice);
      return utterance;
    },

    async speak(text) {
      if (!this.settings.autoPlay) return;
      
      try {
        window.speechSynthesis.cancel();
        const utterance = this.initSpeech(text);
        await new Promise((resolve, reject) => {
          utterance.onend = () => resolve();
          utterance.onerror = (event) => reject(event?.error || new Error('Speech synthesis failed'));
          window.speechSynthesis.speak(utterance);
        });
      } catch (error) {
        console.error('语音播放失败:', error);
      }
    },

    // 练习相关
    switchTask(type) {
      this.currentCategory = type;
      this.resetPracticePool(type);
      this.currentData = {
        ...this.categories[type],
        data: this.practicePools[type]
      };
      this.progressTotal = this.currentData.data.length;
      this.showContainer = false;
      this.next(true);
    },

    async next(ignoreMenu = false) {
      if (!ignoreMenu && this.showingMenu) return;
      
      try {
        if (this.currentData.data.length === 0) {
          if (this.mode === 'wrongs') {
            this.showFeedbackMessage('错题本已复习完成');
            this.exitWrongs();
            return;
          }
          if (this.mode === 'scheduled-review') {
            this.finishScheduledReview();
            return;
          }
          this.resetPracticePool(this.currentCategory);
          this.currentData.data = this.practicePools[this.currentCategory];
          this.progressTotal = this.currentData.data.length;
          this.playSound('success');
        }

        const current = this.getRandomItem();
        const itemCategory = this.getCategoryForItem(current);
        if (itemCategory) {
          this.currentCategory = itemCategory;
        }
        this.currentData.prev = this.currentData.current;
        this.currentData.current = current;
        if (this.currentCategory === 'dw') {
          this.imageLoading = true;
        }
        await this.speak(this.getDisplayText(current));
        
        // 记录复习
        if (this.mode === 'wrongs') {
          this.recordReview(current);
        }
        
      } catch (error) {
        console.error('练习出错:', error);
        this.playSound('error');
      }
    },

    goPrev() {
      if (this.currentData.prev && this.currentData.prev !== this.currentData.current) {
        this.currentData.bakCurrent = this.currentData.current;
        this.currentData.current = this.currentData.prev;
        this.playSound('click');
      }
    },

    getRandomItem() {
      const index = Math.floor(Math.random() * this.currentData.data.length);
      if (this.mode === 'wrongs') {
        return this.currentData.data[index];
      }
      return this.currentData.data.splice(index, 1)[0];
    },

    getDisplayText(item) {
      if (this.currentCategory === 'dw' && typeof item === 'object') {
        return `${item.name}，${item.pinyin}`;
      }
      return item;
    },

    async speakAgain() {
      if (!this.currentData?.current) return;
      await this.speak(this.getDisplayText(this.currentData.current));
    },

    markKnown() {
      this.recordPracticeResult(false);
      this.streakCount++;
      localStorage.setItem('streakCount', String(this.streakCount));
      this.normalizeDailyRewards();
      this.rewardKnownAnswer();
      const praise = this.streakCount >= 5 ? `太棒了，连续会了 ${this.streakCount} 个！` : '真不错，继续下一题';
      if (this.mode === 'wrongs') {
        this.removeCurrentWrong();
      } else {
        this.playSound('success');
      }
      this.showFeedbackMessage(praise);
      this.next(true);
    },

    markNeedsPractice() {
      this.streakCount = 0;
      localStorage.setItem('streakCount', '0');
      this.recordPracticeResult(true);
      this.addWrongs({ recordMistake: false, showFeedback: false });
      this.showFeedbackMessage('没关系，放进错题本，等会儿再来一次');
      this.next(true);
    },

    recordPracticeResult(isWrong) {
      this.updateTodayPracticeCount();
      this.totalPracticeCount++;
      this.recordKnowledgeProgress(isWrong);
      if (isWrong) {
        this.wrongPracticeCount++;
      }
      this.updateCorrectPercentage();
      this.savePracticeStats();
      this.updateDailyRecord(isWrong);
    },

    // 存储相关
    saveWrongs() {
      localStorage.setItem('wrongs', JSON.stringify(this.wrongs.data));
      localStorage.setItem('wrongsCategories', JSON.stringify(this.wrongs.categories));
      localStorage.setItem('wrongsReviewHistory', JSON.stringify(this.wrongs.reviewHistory));
    },

    savePracticeStats() {
      localStorage.setItem('practiceStats', JSON.stringify({
        totalPracticeCount: this.totalPracticeCount,
        wrongPracticeCount: this.wrongPracticeCount,
        todayPracticeCount: this.todayPracticeCount,
        lastPracticeDate: this.lastPracticeDate
      }));
    },

    saveProgress() {
      localStorage.setItem('progress', JSON.stringify({
        category: this.currentCategory,
        data: this.currentData,
        timestamp: Date.now()
      }));
    },

    // 触摸事件处理
    handleTouchStart(event) {
      this.touchStartTime = Date.now();
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.playSound('click');
    },

    handleTouchEnd(event) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const touchDuration = Date.now() - this.touchStartTime;
      
      // 计算滑动距离
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      
      // 判断是否为滑动
      if (Math.abs(deltaX) > this.minSwipeDistance && Math.abs(deltaY) < this.minSwipeDistance) {
        this.playSound('swipe');
        if (deltaX > 0) {
          this.goPrev();
        } else {
          this.speakAgain();
        }
      }
      
      // 判断是否为长按
      if (touchDuration > 500 && 
          Math.abs(deltaX) < 10 && 
          Math.abs(deltaY) < 10) {
        this.showingMenu = true;
      }
    },

    // 阻止默认的双击缩放
    preventZoom(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },

    // 错题本相关方法
    initializeWrongsCategories() {
      this.wrongs.data.forEach(item => {
        const category = this.getCategoryForItem(item);
        if (category && !this.wrongs.categories[category].includes(item)) {
          this.wrongs.categories[category].push(item);
        }
      });
    },

    getItemReviewKey(item) {
      if (typeof item === 'object' && item?.name) return `dw:${item.name}`;
      return `txt:${String(item)}`;
    },

    recordReview(item) {
      const key = this.getItemReviewKey(item);
      this.wrongs.reviewHistory[key] = {
        lastReview: Date.now(),
        count: (this.wrongs.reviewHistory[key]?.count || 0) + 1
      };
      this.saveWrongs();
    },

    updateWrongsAnalysis() {
      const byCategory = {
        py: this.wrongs.categories.py.length,
        cy: this.wrongs.categories.cy.length,
        sz: this.wrongs.categories.sz.length,
        dw: this.wrongs.categories.dw.length
      };
      const commonMistakes = Object.entries(this.wrongs.reviewHistory)
        .sort((a, b) => (b[1]?.count || 0) - (a[1]?.count || 0))
        .slice(0, 10)
        .map(([item, info]) => ({
          item,
          count: info?.count || 0
        }));
      this.wrongs.analysis = {
        total: this.wrongs.data.length,
        byCategory,
        byDifficulty: {},
        commonMistakes
      };
    },
    
    getCategoryForItem(item) {
      if (typeof item === 'object' && item.name) return 'dw';
      if (this.categories.py.data.includes(item)) return 'py';
      if (this.categories.cy.data.includes(item)) return 'cy';
      if (this.categories.sz.data.includes(item)) return 'sz';
      return null;
    },
    
    addWrongs(options = {}) {
      const { recordMistake = true, showFeedback = true } = options;
      if (recordMistake) {
        this.recordPracticeResult(true);
      }
      if (!this.wrongs.data.includes(this.currentData.current)) {
        this.wrongs.data.push(this.currentData.current);
        const category = this.getCategoryForItem(this.currentData.current);
        if (category && !this.wrongs.categories[category].includes(this.currentData.current)) {
          this.wrongs.categories[category].push(this.currentData.current);
        }
        this.saveWrongs();
        this.updateWrongsAnalysis();
        this.playSound('error');
        if (showFeedback) {
          this.showFeedbackMessage('已添加到错题本');
        }
      }
    },

    removeCurrentWrong() {
      if (this.mode === 'wrongs') {
        const current = this.currentData.current;
        this.wrongs.data = this.wrongs.data.filter(item => item !== current);
        const category = this.getCategoryForItem(current);
        if (category) {
          this.wrongs.categories[category] = this.wrongs.categories[category].filter(item => item !== current);
        }
        this.saveWrongs();
        this.updateWrongsAnalysis();
        this.playSound('success');
        this.showFeedbackMessage('已从错题本移除');
      }
    },

    clearWrongs() {
      this.wrongs.data = [];
      Object.keys(this.wrongs.categories).forEach(category => {
        this.wrongs.categories[category] = [];
      });
      this.wrongs.reviewHistory = {};
      this.saveWrongs();
      this.updateWrongsAnalysis();
      this.playSound('error');
      this.showFeedbackMessage('错题本已清空');
    },
    

    exitWrongs() {
      this.mode = 'normal';
      this.currentData = {
        ...this.categories[this.currentCategory],
        data: this.practicePools[this.currentCategory]
      };
      this.progressTotal = this.currentData.data.length;
    },

    openWrongs() {
      if (this.wrongs.data.length === 0) {
        this.showFeedbackMessage('错题本为空');
        this.mode = 'normal';
        return;
      }
      this.mode = 'wrongs';
      this.currentData = this.wrongs;
      this.progressTotal = this.currentData.data.length;
      this.next(true);
    },

    openWrongsFromHome() {
      this.showContainer = false;
      this.openWrongs();
    },

    startScheduledReview() {
      if (this.dueReviewItems.length === 0) {
        this.showFeedbackMessage('今天暂时没有到期复习');
        return;
      }
      this.showContainer = false;
      this.mode = 'scheduled-review';
      this.currentData = {
        type: 'scheduled-review',
        current: '',
        prev: '',
        bakCurrent: '',
        data: [...this.dueReviewItems]
      };
      this.progressTotal = this.currentData.data.length;
      this.next(true);
    },

    finishScheduledReview() {
      this.showFeedbackMessage('今日复习包已完成');
      this.mode = 'normal';
      this.showContainer = true;
      this.currentData = {
        ...this.categories[this.currentCategory],
        data: this.practicePools[this.currentCategory]
      };
      this.progressTotal = this.currentData.data.length;
    },

    showMenu() {
      this.showingMenu = true;
    },

    handleImageLoad() {
      this.imageLoading = false;
    },

    getAnimalFallbackImage(name = '动物') {
      const safeName = String(name).replace(/[<>&'"]/g, '');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#43a047"/><stop offset="100%" stop-color="#26a69a"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="120" cy="120" r="70" fill="rgba(255,255,255,0.15)"/><circle cx="700" cy="520" r="90" fill="rgba(255,255,255,0.12)"/><text x="400" y="280" text-anchor="middle" font-size="84" fill="#ffffff">🐾</text><text x="400" y="360" text-anchor="middle" font-size="42" fill="#ffffff" font-family="Arial, sans-serif">${safeName}</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    },

    handleImageError(e) {
      // 使用本地内联兜底图，避免依赖外部网络
      e.target.onerror = null;
      e.target.src = this.getAnimalFallbackImage(this.currentData?.current?.name);
      this.imageLoading = false;
    },

    // 反馈效果
    showFeedbackMessage(message) {
      this.showFeedback = true;
      this.feedbackMessage = message;
      setTimeout(() => {
        this.showFeedback = false;
      }, 3000);
    },

    // 设置面板
    showSettings() {
      this.showSettingsPanel = true;
      this.showingMenu = false;
    },

    saveSettings(nextSettings) {
      if (nextSettings) {
        this.settings = nextSettings;
      }
      localStorage.setItem('settings', JSON.stringify(this.settings));
      this.showSettingsPanel = false;
      this.playSound('success');
      this.showFeedbackMessage('设置已保存');
    },

    // 统计面板
    showStats() {
      this.showStatsPanel = true;
      this.showingMenu = false;
    },

    showPrivacyCenter() {
      this.showPrivacyPanel = true;
      this.showingMenu = false;
    },

    buildLocalDataExport() {
      return {
        exportedAt: new Date().toISOString(),
        privacy: this.privacyNote,
        childProfile: {
          childName: this.childName,
          childStage: this.childStage,
          sessionPace: this.sessionPace,
          adventureTheme: this.adventureTheme,
          familyScene: this.familyScene,
          learningMood: this.learningMood,
          onboardingProfile: this.onboardingProfile
        },
        stats: {
          totalPracticeCount: this.totalPracticeCount,
          todayPracticeCount: this.todayPracticeCount,
          correctPercentage: this.correctPercentage,
          wrongPracticeCount: this.wrongPracticeCount,
          todayStarCount: this.todayStarCount,
          consecutiveLearningDays: this.consecutiveLearningDays
        },
        wrongs: this.wrongs,
        knowledgeProgress: this.knowledgeProgress,
        learningStats: this.learningStats,
        settings: this.settings
      };
    },

    exportLocalData() {
      const data = this.buildLocalDataExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `parent-learning-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.showFeedbackMessage('本机数据已导出');
    },

    async copyPrivacyNote() {
      try {
        await navigator.clipboard.writeText(this.privacyNote);
        this.showFeedbackMessage('隐私说明已复制');
      } catch (err) {
        console.error('复制失败:', err);
        this.showFeedbackMessage('复制失败，请稍后再试');
      }
    },

    resetTodayData() {
      const today = new Date().toISOString().split('T')[0];
      this.todayPracticeCount = 0;
      this.todayStarCount = 0;
      this.dailyGoalShownDate = '';
      this.restReminderShownKey = '';
      if (this.learningStats.dailyRecords?.[today]) {
        this.$delete(this.learningStats.dailyRecords, today);
      }
      localStorage.setItem('todayStarCount', '0');
      localStorage.removeItem('dailyGoalShownDate');
      localStorage.removeItem('restReminderShownKey');
      this.savePracticeStats();
      this.saveLearningStats();
      this.showFeedbackMessage('今日数据已清理');
    },

    resetAllLocalData() {
      const confirmed = window.confirm('确定要清空全部本机数据吗？这会删除孩子昵称、练习记录、错题、学习地图、周报和设置，且不可恢复。');
      if (!confirmed) return;
      [
        'wrongs',
        'wrongsCategories',
        'wrongsReviewHistory',
        'settings',
        'practiceStats',
        'progress',
        'soundEnabled',
        'learningStats',
        'reviewReminder',
        'childName',
        'sessionPace',
        'adventureTheme',
        'familyScene',
        'learningMood',
        'onboardingProfile',
        'onboardingCompleted',
        'knowledgeProgress',
        'streakCount',
        'todayStarCount',
        'starDate',
        'consecutiveLearningDays',
        'lastLearningDate',
        'childStage',
        'dailyGoalShownDate',
        'restReminderShownKey'
      ].forEach(key => localStorage.removeItem(key));
      window.location.reload();
    },

    // 分享
    share() {
      this.showSharePanel = true;
      this.showingMenu = false;
    },

    getShareText() {
      return [
        '我在用一个亲子陪学小工具，适合3-7岁孩子每天练一小轮拼音、数字、成语和动物认知。',
        '它会按年龄阶段推荐陪学路线，还有今日目标、错题复习、小星星和休息提醒。',
        `打开试试：${window.location.href}`
      ].join('\n');
    },

    getDailyReportText() {
      const name = this.childName || '宝贝';
      const goalStatus = this.todayPracticeCount >= this.dailyGoalCount ? '已完成今日目标' : `距离今日目标还差 ${Math.max(0, this.dailyGoalCount - this.todayPracticeCount)} 题`;
      const wrongText = this.wrongs.data.length > 0 ? `错题本还有 ${this.wrongs.data.length} 题，适合下次短短复习。` : '错题本已经清爽，今天收尾很漂亮。';
      const paceLabels = {
        light: '轻松',
        normal: '标准',
        challenge: '挑战'
      };
      const moodLabels = {
        curious: '想玩想试',
        tired: '有点累',
        resistant: '有点抗拒'
      };
      return [
        `${name}今天的陪学小报告`,
        `今日节奏：${paceLabels[this.sessionPace] || '标准'}`,
        `孩子状态：${moodLabels[this.learningMood] || '想玩想试'}`,
        `完成题数：${this.todayPracticeCount}/${this.dailyGoalCount}（${goalStatus}）`,
        `正确率：${this.correctPercentage}%`,
        `今日小星星：${this.todayStarCount} 颗`,
        `连续陪学：${this.consecutiveLearningDays} 天`,
        wrongText,
        '今天最重要的不是做了多少题，而是孩子愿意开口、愿意继续。'
      ].join('\n');
    },

    async copyShareText() {
      try {
        await navigator.clipboard.writeText(this.getShareText());
        this.playSound('success');
        this.showFeedbackMessage('邀请文案已复制');
        this.showSharePanel = false;
      } catch (err) {
        console.error('复制失败:', err);
        this.playSound('error');
        this.showFeedbackMessage('复制失败，请手动复制链接');
      }
    },

    async copyDailyReport() {
      try {
        await navigator.clipboard.writeText(this.getDailyReportText());
        this.playSound('success');
        this.showFeedbackMessage('今日报告已复制');
        this.showSharePanel = false;
      } catch (err) {
        console.error('复制失败:', err);
        this.playSound('error');
        this.showFeedbackMessage('复制失败，请手动复制');
      }
    },

    getWeeklyReportText() {
      const name = this.childName || '宝贝';
      const insight = this.weeklyInsights;
      const fastestText = insight.fastest?.mastered > 0
        ? `${insight.fastest.title}进步最明显`
        : '本周还在建立第一批掌握点';
      const focusText = insight.needsAttention?.due > 0
        ? `下周先复习${insight.needsAttention.title}`
        : '下周可以继续探索新内容';
      const mistakeText = insight.repeatedMistakes.length > 0
        ? `反复卡住：${insight.repeatedMistakes.join('、')}`
        : '本周暂无明显反复卡点';
      return [
        `${name}的本周成长小结`,
        `本周陪学：${insight.activeDays} 天`,
        `本周完成：${insight.totalCount} 题`,
        `本周正确率：${insight.accuracy}%`,
        `当前到期复习：${this.dueReviewCount} 题`,
        fastestText,
        mistakeText,
        focusText,
        '真正值得表扬的，是孩子这一周一直在把一点点内容变成熟悉。'
      ].join('\n');
    },

    async copyWeeklyReport() {
      try {
        await navigator.clipboard.writeText(this.getWeeklyReportText());
        this.playSound('success');
        this.showFeedbackMessage('本周成长小结已复制');
      } catch (err) {
        console.error('复制失败:', err);
        this.playSound('error');
        this.showFeedbackMessage('复制失败，请稍后再试');
      }
    },

    async copyCoachScript(script) {
      try {
        await navigator.clipboard.writeText(script);
        this.playSound('success');
        this.showFeedbackMessage('陪学话术已复制，今天照着说就行');
      } catch (err) {
        console.error('复制失败:', err);
        this.playSound('error');
        this.showFeedbackMessage('复制失败，请手动查看陪学话术');
      }
    },

    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.playSound('success');
        this.showFeedbackMessage('链接已复制到剪贴板');
        this.showSharePanel = false;
      } catch (err) {
        console.error('复制失败:', err);
        this.playSound('error');
        this.showFeedbackMessage('复制失败，请手动复制');
      }
    },

    // 更新今日练习次数
    updateTodayPracticeCount() {
      const today = new Date().toDateString();
      if (this.lastPracticeDate !== today) {
        this.todayPracticeCount = 0;
        this.lastPracticeDate = today;
        this.dailyGoalShownDate = '';
        localStorage.removeItem('dailyGoalShownDate');
      }
      this.normalizeDailyRewards(today);
      this.updateLearningDay(today);
      this.todayPracticeCount++;
      this.checkDailyGoal(today);
      this.checkRestReminder(today);
    },

    checkDailyGoal(today = new Date().toDateString()) {
      if (
        this.todayPracticeCount >= this.dailyGoalCount &&
        this.dailyGoalShownDate !== today
      ) {
        this.dailyGoalShownDate = today;
        localStorage.setItem('dailyGoalShownDate', today);
        this.showGoalCelebration = true;
        this.playSound('success');
      }
    },

    finishDailyGoal() {
      this.showGoalCelebration = false;
      this.showContainer = true;
      this.showingMenu = false;
      window.speechSynthesis.cancel();
    },

    continueAfterGoal() {
      this.showGoalCelebration = false;
    },

    checkRestReminder(today = new Date().toDateString()) {
      if (this.showGoalCelebration || this.todayPracticeCount <= 0) return;
      if (this.todayPracticeCount % this.restReminderInterval !== 0) return;
      const reminderKey = `${today}:${this.todayPracticeCount}:${this.childStage}:${this.learningMood}`;
      if (this.restReminderShownKey === reminderKey) return;
      this.restReminderShownKey = reminderKey;
      localStorage.setItem('restReminderShownKey', reminderKey);
      this.showRestReminder = true;
    },

    restNow() {
      this.showRestReminder = false;
      this.showContainer = true;
      this.showingMenu = false;
      window.speechSynthesis.cancel();
    },

    continueAfterRest() {
      this.showRestReminder = false;
    },

    // 播放音效
    playSound(type) {
      if (!this.soundEnabled) return;
      const url = this.soundUrls[type];
      if (!url) return;
      if (!this.soundCache[type]) {
        const sound = new Audio(url);
        sound.volume = 0.5;
        this.$set(this.soundCache, type, sound);
      }
      const sound = this.soundCache[type];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.log('音效播放失败:', err));
      }
    },
    
    // 切换声音开关
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('soundEnabled', JSON.stringify(this.soundEnabled));
      this.showFeedbackMessage(this.soundEnabled ? '已开启音效' : '已关闭音效');
    },

    // 学习记录相关方法
    startLearning() {
      this.learningStats.startTime = Date.now();
      this.ensureTodayRecord();
      this.saveLearningStats();
    },

    ensureTodayRecord() {
      const today = new Date().toISOString().split('T')[0];
      if (!this.learningStats.dailyRecords[today]) {
        this.learningStats.dailyRecords[today] = {
          time: 0,
          count: 0,
          correct: 0,
          wrong: 0
        };
      }
    },
    
    stopLearning() {
      if (this.learningStats.startTime) {
        const learningTime = Math.floor((Date.now() - this.learningStats.startTime) / 1000);
        this.learningStats.totalTime += learningTime;
        this.learningStats.startTime = null;
        this.saveLearningStats();
      }
    },
    
    updateDailyRecord(isWrong = false) {
      this.ensureTodayRecord();
      const today = new Date().toISOString().split('T')[0];
      this.learningStats.dailyRecords[today].count++;
      if (isWrong) {
        this.learningStats.dailyRecords[today].wrong++;
      } else {
        this.learningStats.dailyRecords[today].correct++;
      }
      this.updateWeeklyProgress(isWrong);
      this.updateMonthlyProgress(isWrong);
      this.saveLearningStats();
    },
    
    updateWeeklyProgress(isWrong = false) {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      let weekIndex = this.learningStats.weeklyProgress.findIndex(w => w.week === weekKey);
      if (weekIndex === -1) {
        this.learningStats.weeklyProgress.push({
          week: weekKey,
          time: 0,
          count: 0,
          correct: 0,
          wrong: 0
        });
        weekIndex = this.learningStats.weeklyProgress.length - 1;
      }

      this.learningStats.weeklyProgress[weekIndex].count++;
      if (isWrong) {
        this.learningStats.weeklyProgress[weekIndex].wrong++;
      } else {
        this.learningStats.weeklyProgress[weekIndex].correct++;
      }
    },
    
    updateMonthlyProgress(isWrong = false) {
      const today = new Date();
      const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      
      let monthIndex = this.learningStats.monthlyProgress.findIndex(m => m.month === monthKey);
      if (monthIndex === -1) {
        this.learningStats.monthlyProgress.push({
          month: monthKey,
          time: 0,
          count: 0,
          correct: 0,
          wrong: 0
        });
        monthIndex = this.learningStats.monthlyProgress.length - 1;
      }

      this.learningStats.monthlyProgress[monthIndex].count++;
      if (isWrong) {
        this.learningStats.monthlyProgress[monthIndex].wrong++;
      } else {
        this.learningStats.monthlyProgress[monthIndex].correct++;
      }
    },
    
    saveLearningStats() {
      localStorage.setItem('learningStats', JSON.stringify(this.learningStats));
    },
    
    // 导出学习记录
    exportLearningStats() {
      const data = {
        totalTime: this.totalLearningTime,
        formattedTime: this.formattedLearningTime,
        dailyRecords: this.learningStats.dailyRecords,
        weeklyProgress: this.learningStats.weeklyProgress,
        monthlyProgress: this.learningStats.monthlyProgress,
        totalPracticeCount: this.totalPracticeCount,
        correctPercentage: this.correctPercentage,
        wrongsCount: this.wrongs.data.length
      };
      
      if (this.exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // CSV格式导出
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning-stats-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      this.playSound('success');
      this.showFeedbackMessage('学习记录已导出');
    },
    
    convertToCSV(data) {
      const headers = ['日期', '练习次数', '正确率', '学习时长'];
      const rows = Object.entries(data.dailyRecords).map(([date, record]) => [
        date,
        record.count,
        `${record.count > 0 ? (record.correct / record.count * 100).toFixed(1) : '0.0'}%`,
        `${Math.floor(record.time / 3600)}小时${Math.floor((record.time % 3600) / 60)}分`
      ]);
      
      return [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
    },
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.saveProgress);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.preventZoom);
    if (this.installPromptHandler) {
      window.removeEventListener('beforeinstallprompt', this.installPromptHandler);
    }
    if (this.appInstalledHandler) {
      window.removeEventListener('appinstalled', this.appInstalledHandler);
    }
    
    // 保存练习统计
    this.savePracticeStats();
    
    this.stopLearning();
  }
}
</script>

<style>
/* 基础样式 */
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --accent-color: #FF9800;
  --text-color: #333333;
  --text-light: #666666;
  --bg-color: #f5f5f5;
  --card-bg: #ffffff;
  --card-shadow: 0 4px 12px rgba(0,0,0,0.1);
  --card-shadow-hover: 0 8px 24px rgba(0,0,0,0.15);
  --transition-speed: 0.3s;
  --progress-height: 4px;
  --progress-bg: rgba(255,255,255,0.2);
  --progress-fill: rgba(255,255,255,0.8);
}

#app {
  overflow: hidden;
  height: 100vh;
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 练习内容区域 */
.main {
  font-family: 'pinyin';
  font-size: min(calc(20vw * 1.2), 80px);
  text-align: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 20px;
  line-height: 1.2;
  word-break: break-all;
  background: var(--card-bg);
  margin: 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed) ease;
  position: relative;
  overflow: hidden;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
  z-index: 0;
}

.main[data-category="py"]::before {
  background-image: linear-gradient(45deg, rgba(76, 175, 80, 0.8), rgba(33, 150, 243, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=py-main&backgroundColor=4CAF50,2196F3');
}

.main[data-category="cy"]::before {
  background-image: linear-gradient(45deg, rgba(255, 152, 0, 0.8), rgba(244, 67, 54, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=cy-main&backgroundColor=FF9800,F44336');
}

.main[data-category="sz"]::before {
  background-image: linear-gradient(45deg, rgba(156, 39, 176, 0.8), rgba(233, 30, 99, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=sz-main&backgroundColor=9C27B0,E91E63');
}

.main[data-category="dw"]::before {
  background-image: linear-gradient(45deg, rgba(0, 150, 136, 0.8), rgba(76, 175, 80, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=dw-main&backgroundColor=009688,4CAF50');
}

.main > span {
  position: relative;
  z-index: 1;
}

#app.is-practicing .main {
  height: calc(100vh - 190px);
  margin-bottom: 140px;
}

#app.is-practicing .animal-card {
  margin-bottom: 150px;
}

/* 任务选择网格 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
  height: auto;
  min-height: 60vh;
  max-width: 1200px;
  margin: 0 auto;
}

/* 任务卡片 */
.task {
  font-family: 'pinyin';
  font-size: clamp(16px, 5vw, 24px);
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed) ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.task::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
  z-index: 0;
}

.task[data-category="py"]::before {
  background-image: linear-gradient(45deg, rgba(76, 175, 80, 0.8), rgba(33, 150, 243, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=py&backgroundColor=4CAF50,2196F3');
}

.task[data-category="cy"]::before {
  background-image: linear-gradient(45deg, rgba(255, 152, 0, 0.8), rgba(244, 67, 54, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=cy&backgroundColor=FF9800,F44336');
}

.task[data-category="sz"]::before {
  background-image: linear-gradient(45deg, rgba(156, 39, 176, 0.8), rgba(233, 30, 99, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=sz&backgroundColor=9C27B0,E91E63');
}

.task[data-category="dw"]::before {
  background-image: linear-gradient(45deg, rgba(0, 150, 136, 0.8), rgba(76, 175, 80, 0.8)), url('https://api.dicebear.com/7.x/shapes/svg?seed=dw&backgroundColor=009688,4CAF50');
}

.task > span {
  position: relative;
  z-index: 1;
}

.task:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
}

.task:hover::before {
  opacity: 1;
}

.task:active {
  transform: scale(0.95);
}

/* 动物卡片样式 */
.animal-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 20px;
  margin: 20px auto;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed) ease;
  cursor: pointer;
  max-width: 500px;
  position: relative;
  overflow: hidden;
}

.animal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0, 150, 136, 0.1), rgba(76, 175, 80, 0.1));
  z-index: 0;
}

.animal-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 宽高比 */
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-color);
}

.animal-card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform var(--transition-speed) ease;
}

.animal-card img.image-loading {
  opacity: 0;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--primary-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animal-info {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  margin-top: 15px;
}

.animal-name {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 8px;
}

.animal-pinyin {
  font-family: 'pinyin';
  font-size: 24px;
  color: var(--text-light);
}

/* 描述文本 */
.desc {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--card-bg);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  font-size: 14px;
  color: var(--text-light);
  z-index: 100;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(5px);
}

/* 返回按钮 */
.return {
  position: fixed;
  top: 20px;
  left: 20px;
  background: var(--card-bg);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  z-index: 100;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(5px);
}

.return:hover {
  transform: translateX(5px);
  background: var(--primary-color);
  color: white;
}

/* 菜单样式 */
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--transition-speed) ease;
}

.menu {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 20px;
  width: 80%;
  max-width: 400px;
  box-shadow: var(--card-shadow);
  animation: slideUp var(--transition-speed) ease;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
}

.menu-item {
  padding: 15px 20px;
  margin: 5px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  color: var(--text-color);
  background: rgba(255, 255, 255, 0.5);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(5px);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  padding: 15px;
  }

  .main {
    font-size: min(calc(25vw * 1.2), 60px);
    margin: 10px;
  }

  #app.is-practicing .main {
    height: calc(100vh - 330px);
    margin-top: 170px;
    margin-bottom: 160px;
  }

  .animal-card {
    margin: 10px;
    padding: 15px;
  }

  #app.is-practicing .animal-card {
    margin-top: 170px;
    margin-bottom: 160px;
    max-height: calc(100vh - 330px);
    overflow-y: auto;
  }

  .animal-name {
    font-size: 24px;
  }

  .animal-pinyin {
    font-size: 20px;
  }

  .menu {
  width: 90%;
  }

  .task {
    padding: 20px;
  }

  .desc {
    bottom: 12px;
    left: 10px;
    transform: none;
    max-width: 48vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 9px 12px;
  }

  .share-button {
    left: auto;
    right: 10px;
    bottom: 10px;
    padding: 9px 12px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --card-bg: #2d2d2d;
    --text-color: #ffffff;
    --text-light: #b3b3b3;
  }

  .animal-info {
    background: rgba(45, 45, 45, 0.9);
  }

  .desc, .return {
    background: linear-gradient(45deg, rgba(45, 45, 45, 0.9), rgba(45, 45, 45, 0.8));
  }

  .menu {
    background: linear-gradient(45deg, rgba(45, 45, 45, 0.95), rgba(45, 45, 45, 0.9));
}

.menu-item {
    background: rgba(45, 45, 45, 0.5);
  }

  .menu-item:hover {
    background: rgba(45, 45, 45, 0.8);
  }
}

/* 进度条 */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--progress-height);
  background: var(--progress-bg);
  z-index: 1000;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--progress-fill);
  transition: width 0.3s ease;
}

/* 装饰元素 */
.decoration {
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle:nth-child(1) {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  background: var(--primary-color);
  animation-delay: 0s;
}

.decoration-circle:nth-child(2) {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  background: var(--secondary-color);
  animation-delay: -2s;
}

.decoration-circle:nth-child(3) {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  background: var(--accent-color);
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
}

/* 反馈效果 */
.feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  font-size: 24px;
  color: var(--text-color);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.feedback.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.feedback.hide {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

/* 设置面板样式优化 */
.settings-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: var(--card-bg);
  padding: 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  z-index: 1000;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: all 0.3s ease;
  width: 90%;
  max-width: 400px;
}

.settings-panel.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.settings-header h3 {
  margin: 0;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-light);
  padding: 0 5px;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-color);
}

.settings-content {
  margin-bottom: 20px;
}

.settings-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  color: var(--text-color);
}

.settings-item label {
  flex: 1;
  margin-right: 10px;
}

.settings-item input[type="range"] {
  flex: 2;
  margin: 0 10px;
}

.settings-item .value {
  min-width: 40px;
  text-align: right;
}

.settings-footer {
  text-align: right;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* 统计面板样式优化 */
.stats-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: var(--card-bg);
  padding: 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  z-index: 1000;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: all 0.3s ease;
  width: 90%;
  max-width: 720px;
}

.stats-panel.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.stats-header h3 {
  margin: 0;
  color: var(--text-color);
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stats-item {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stats-item .label {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.stats-item .value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .settings-panel,
  .stats-panel {
    background: rgba(45, 45, 45, 0.95);
  }

  .settings-header,
  .stats-header {
    border-bottom-color: rgba(255,255,255,0.1);
  }

  .settings-item {
    background: rgba(255,255,255,0.05);
  }

  .stats-item {
    background: rgba(255,255,255,0.05);
  }
}

/* 分享按钮 */
.share-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: var(--card-bg);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 5px;
}

.share-button:hover {
  transform: translateX(5px);
  background: var(--primary-color);
  color: white;
}

/* 优化动画 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* 分享面板样式 */
.share-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: var(--card-bg);
  padding: 20px;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  z-index: 1000;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: all 0.3s ease;
  width: 90%;
  max-width: 400px;
}

.share-panel.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.share-header h3 {
  margin: 0;
  color: var(--text-color);
}

.share-intro {
  margin: -6px 0 16px;
  color: var(--text-light);
  line-height: 1.6;
}

.share-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.share-item {
  border: 0;
  background: rgba(255,255,255,0.18);
  padding: 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font: inherit;
  color: var(--text-color);
}

.share-item:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.2);
}

.share-item span {
  font-size: 16px;
  font-weight: 900;
  color: var(--text-color);
}

.share-item small {
  margin-top: 6px;
  color: var(--text-light);
  line-height: 1.4;
}

.primary-share {
  background: #1f7a4a;
}

.primary-share span,
.primary-share small {
  color: #ffffff;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .share-panel {
    background: rgba(45, 45, 45, 0.95);
  }

  .share-header {
    border-bottom-color: rgba(255,255,255,0.1);
  }

  .share-item {
    background: rgba(255,255,255,0.05);
  }

  .share-item:hover {
    background: rgba(255,255,255,0.1);
  }
}
</style>
