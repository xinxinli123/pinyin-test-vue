<template>
  <div class="privacy-overlay">
    <section class="privacy-panel">
      <div class="privacy-header">
        <div>
          <span>隐私与数据中心</span>
          <h3>家长可以清楚知道数据在哪里，也可以随时带走或清空。</h3>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="privacy-promise">
        <strong>当前版本的数据默认只保存在这台设备的浏览器里。</strong>
        <p>{{ privacyNote }}</p>
      </div>

      <div class="data-grid">
        <article>
          <span>练习记录</span>
          <strong>{{ localDataSummary.totalPracticeCount }}</strong>
          <small>累计完成题数</small>
        </article>
        <article>
          <span>知识点</span>
          <strong>{{ localDataSummary.knowledgeCount }}</strong>
          <small>已记录掌握度</small>
        </article>
        <article>
          <span>错题</span>
          <strong>{{ localDataSummary.wrongCount }}</strong>
          <small>保存在本机错题本</small>
        </article>
        <article>
          <span>学习天数</span>
          <strong>{{ localDataSummary.recordDays }}</strong>
          <small>有本地记录的日期</small>
        </article>
      </div>

      <div class="privacy-actions">
        <button class="primary" @click="$emit('export-data')">
          <span>导出本机数据</span>
          <small>生成 JSON 备份文件</small>
        </button>
        <button @click="$emit('copy-privacy-note')">
          <span>复制隐私说明</span>
          <small>方便发布前放到说明页</small>
        </button>
        <button @click="$emit('reset-today')">
          <span>清理今日数据</span>
          <small>只重置今天的练习进度</small>
        </button>
        <button class="danger" @click="$emit('reset-all')">
          <span>重置全部本机数据</span>
          <small>清空后不可恢复</small>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DataPrivacyPanel',
  props: {
    localDataSummary: {
      type: Object,
      required: true
    },
    privacyNote: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.privacy-overlay {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(22, 34, 26, 0.5);
  backdrop-filter: blur(10px);
}

.privacy-panel {
  width: min(720px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 14px;
  padding: 24px;
  background:
    radial-gradient(circle at 92% 10%, rgba(255, 207, 90, 0.24), transparent 28%),
    linear-gradient(135deg, #fff8dc, #e8f7ec);
  color: #17251c;
  box-shadow: 0 26px 74px rgba(15, 30, 20, 0.3);
}

.privacy-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.privacy-header span {
  color: #1f7a4a;
  font-weight: 900;
}

.privacy-header h3 {
  margin: 8px 0 0;
  font-size: 26px;
  line-height: 1.25;
}

.close-btn {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #536356;
  cursor: pointer;
  font-size: 24px;
}

.privacy-promise,
.data-grid article {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
}

.privacy-promise {
  margin-top: 18px;
  padding: 16px;
}

.privacy-promise strong,
.privacy-promise p {
  display: block;
}

.privacy-promise p {
  margin: 8px 0 0;
  color: #536356;
  line-height: 1.7;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.data-grid article {
  min-height: 112px;
  padding: 14px;
}

.data-grid span,
.data-grid strong,
.data-grid small {
  display: block;
}

.data-grid span,
.data-grid small {
  color: #657267;
}

.data-grid strong {
  margin: 10px 0 4px;
  font-size: 30px;
}

.privacy-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.privacy-actions button {
  min-height: 74px;
  border: 0;
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.82);
  color: #243028;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.privacy-actions button.primary {
  background: #1f7a4a;
  color: #ffffff;
}

.privacy-actions button.danger {
  background: #ffe2b8;
  color: #6b2b13;
}

.privacy-actions span,
.privacy-actions small {
  display: block;
}

.privacy-actions span {
  font-weight: 900;
}

.privacy-actions small {
  margin-top: 6px;
  opacity: 0.78;
  line-height: 1.35;
}

@media (max-width: 640px) {
  .privacy-panel {
    padding: 18px;
  }

  .privacy-header h3 {
    font-size: 22px;
  }

  .data-grid,
  .privacy-actions {
    grid-template-columns: 1fr;
  }
}
</style>
