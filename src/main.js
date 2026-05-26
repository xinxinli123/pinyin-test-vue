import Vue from 'vue'
import App from './App.vue'
import LongPress from './longpress.js'
Vue.use(LongPress, {time: 500})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`)
      .catch(error => {
        console.warn('Service worker registration failed:', error)
      })
  })
}
