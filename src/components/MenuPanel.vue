<template>
  <div class="menu-wrapper" v-show="show" @click="$emit('close')">
    <div class="flex-spacer"></div>
    <div class="menu">
      <div
        class="menu-item"
        v-show="currentData.prev && currentData.prev !== currentData.current"
        @click="$emit('go-prev')"
      >
        上一个
      </div>
      <div class="menu-item" @click="$emit('add-wrongs')" v-show="mode !== 'wrongs'">加入错题本</div>
      <div
        class="menu-item"
        @click="$emit('open-wrongs')"
        v-show="wrongs.data.length > 0 && mode !== 'wrongs'"
      >
        进入错题本 {{ `[${wrongs.data.length}个]` }}
      </div>
      <div class="menu-item" @click="$emit('remove-current-wrong')" v-show="mode == 'wrongs'">
        记住了，移出：<span style="font-family: 'pinyin'">{{ currentData.current }}</span>
      </div>
      <div
        class="menu-item"
        @click="$emit('clear-wrongs')"
        v-show="mode == 'wrongs'"
        style="color: #F56C6C;"
      >
        清空错题本
      </div>
      <div class="menu-item" @click="$emit('exit-wrongs')" v-show="mode == 'wrongs'">退出错题本</div>
      <div class="menu-item" @click="$emit('show-settings')">设置</div>
      <div class="menu-item" @click="$emit('show-stats')">统计</div>
    </div>
    <div class="flex-spacer"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuPanel',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    currentData: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    wrongs: {
      type: Object,
      required: true
    }
  }
}
</script>
