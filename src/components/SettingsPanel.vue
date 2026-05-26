<template>
  <div class="settings-panel" :class="{ show }">
    <div class="settings-header">
      <h3>设置</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="settings-content">
      <div class="settings-item">
        <label>语音速度:</label>
        <input type="range" min="0.5" max="2" step="0.1" v-model="draft.voice.rate">
        <span class="value">{{ draft.voice.rate }}</span>
      </div>
      <div class="settings-item">
        <label>语音音调:</label>
        <input type="range" min="0.5" max="2" step="0.1" v-model="draft.voice.pitch">
        <span class="value">{{ draft.voice.pitch }}</span>
      </div>
      <div class="settings-item">
        <label>语言:</label>
        <select v-model="draft.voice.preferredLang">
          <option value="zh-CN">中文</option>
          <option value="en-US">英文</option>
        </select>
      </div>
      <div class="settings-item">
        <label>自动播放:</label>
        <input type="checkbox" v-model="draft.autoPlay">
      </div>
      <div class="settings-item">
        <label>显示拼音:</label>
        <input type="checkbox" v-model="draft.showPinyin">
      </div>
    </div>
    <div class="settings-footer">
      <button class="save-btn" @click="$emit('save', draft)">保存设置</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPanel',
  data() {
    return {
      draft: this.cloneSettings(this.settings)
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  watch: {
    settings: {
      deep: true,
      handler(value) {
        this.draft = this.cloneSettings(value)
      }
    }
  },
  methods: {
    cloneSettings(settings) {
      return JSON.parse(JSON.stringify(settings))
    }
  }
}
</script>
