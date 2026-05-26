<template>
  <div class="practice-controls">
    <div class="reading-prompt">
      <span>本题陪读 · {{ adventureName }}</span>
      <strong>{{ promptText }}</strong>
      <em>{{ missionNudge }}</em>
      <em class="scene-tip">{{ sceneNudge }}</em>
      <em class="mood-tip">{{ moodNudge }}</em>
    </div>
    <button class="control-button known" @click="$emit('known')">
      <span>会了</span>
      <small>鼓励一下，下一题</small>
    </button>
    <button class="control-button retry" @click="$emit('retry')">
      <span>再练一次</span>
      <small>加入错题，稍后复习</small>
    </button>
    <button class="icon-button" title="再听一遍" @click="$emit('speak-again')">听</button>
    <button class="icon-button" title="更多操作" @click="$emit('menu')">更多</button>
  </div>
</template>

<script>
export default {
  name: 'PracticeControls',
  props: {
    currentCategory: {
      type: String,
      required: true
    },
    childStage: {
      type: String,
      required: true
    },
    adventureTheme: {
      type: String,
      default: 'forest'
    },
    familyScene: {
      type: String,
      default: 'afterMeal'
    },
    learningMood: {
      type: String,
      default: 'curious'
    }
  },
  computed: {
    adventureName() {
      const names = {
        forest: '森林探险队',
        space: '星星列车',
        ocean: '海边寻宝'
      }
      return names[this.adventureTheme] || names.forest
    },
    missionNudge() {
      const nudges = {
        forest: '找到一个声音脚印，答完就往前走一步。',
        space: '点亮这一站，慢慢读也算到站。',
        ocean: '打开这一枚小贝壳，不会就先收进错题袋。'
      }
      return nudges[this.adventureTheme] || nudges.forest
    },
    sceneNudge() {
      const nudges = {
        morning: '早晨模式：只热身，不催速度。',
        afterMeal: '饭后模式：稳定做一轮，不拉扯。',
        bedtime: '睡前模式：声音放轻，完成就收尾。'
      }
      return nudges[this.familyScene] || nudges.afterMeal
    },
    moodNudge() {
      const nudges = {
        curious: '状态提示：让孩子多一点选择权，可以反过来考家长。',
        tired: '状态提示：少做一点也算完成，答完及时休息。',
        resistant: '状态提示：先听先看都可以，不急着要求马上读对。'
      }
      return nudges[this.learningMood] || nudges.curious
    },
    promptText() {
      if (this.childStage === '3-4') {
        const prompts = {
          py: '家长先读一遍，让孩子模仿声音就好。',
          sz: '让孩子边读边伸手指数一数。',
          dw: '先问“你看到了什么？”，再读名字。',
          cy: '家长讲意思，孩子说一个关键词。'
        }
        return prompts[this.currentCategory] || '愿意开口，就是今天的进步。'
      }
      if (this.childStage === '6-7') {
        const prompts = {
          py: '让孩子自己拼一次，家长只提示声调。',
          sz: '读完后试试倒着读或跳着读。',
          dw: '说名字后，再补一句它的特点。',
          cy: '读完后，让孩子用它说一句话。'
        }
        return prompts[this.currentCategory] || '鼓励孩子多说一句自己的想法。'
      }
      const prompts = {
        py: '孩子读一遍，家长轻声带读一遍。',
        sz: '读完数字，再用生活里的东西数一数。',
        dw: '看图说名字，再跟读拼音。',
        cy: '先猜意思，再听家长讲一个小场景。'
      }
      return prompts[this.currentCategory] || '轻松陪读一小会儿就好。'
    }
  }
}
</script>

<style scoped>
.practice-controls {
  position: fixed;
  left: 50%;
  bottom: 76px;
  z-index: 130;
  display: grid;
  grid-template-columns: minmax(240px, 1.2fr) minmax(140px, 1fr) minmax(140px, 1fr) 64px 64px;
  gap: 10px;
  width: min(980px, calc(100vw - 40px));
  transform: translateX(-50%);
}

.reading-prompt {
  min-height: 62px;
  border-radius: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 24px rgba(28, 45, 35, 0.14);
  color: #17251c;
}

.reading-prompt span,
.reading-prompt strong {
  display: block;
}

.reading-prompt span {
  color: #4f7d5a;
  font-size: 12px;
  font-weight: 900;
}

.reading-prompt strong {
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.35;
}

.reading-prompt em {
  display: block;
  margin-top: 5px;
  color: #7a6828;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: 1.35;
}

.reading-prompt .scene-tip {
  color: #4f7d5a;
}

.reading-prompt .mood-tip {
  color: #8a5b00;
}

.control-button,
.icon-button {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(28, 45, 35, 0.16);
  font: inherit;
}

.control-button {
  min-height: 62px;
  padding: 10px 14px;
  text-align: left;
  color: #17251c;
}

.control-button span,
.control-button small {
  display: block;
}

.control-button span {
  font-size: 18px;
  font-weight: 900;
}

.control-button small {
  margin-top: 4px;
  color: rgba(23, 37, 28, 0.68);
}

.known {
  background: #bdecc8;
}

.retry {
  background: #ffe2b8;
}

.icon-button {
  min-height: 62px;
  background: rgba(255, 255, 255, 0.92);
  color: #243028;
  font-weight: 900;
}

@media (max-width: 768px) {
  .practice-controls {
    bottom: 54px;
    grid-template-columns: 1fr 1fr;
    width: calc(100vw - 20px);
  }

  .reading-prompt {
    grid-column: 1 / -1;
    min-height: auto;
  }

  .control-button {
    min-height: 58px;
  }

  .control-button small {
    display: none;
  }

  .icon-button {
    min-height: 44px;
  }
}
</style>
