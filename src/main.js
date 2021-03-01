import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookie from 'vue-cookies'
import { isAuth } from './utils/common'
// eslint-disable-next-line no-unused-vars
import Vant from  'vant'
import Nutui from  '@nutui/nutui'
import $http from './utils/http'

// reset.scss
import './assets/style/global.scss'
import '@nutui/nutui/dist/nutui.css'
import 'vant/lib/index.css';


import VuePreview from 'vue-preview';
Vue.use(VuePreview);

Vue.use(Vant);
Vue.use(Nutui)
Vue.use(ElementUI)
Vue.use(VueCookie)

Vue.config.productionTip = false
Vue.prototype.$http = $http
Vue.prototype.$isAuth = isAuth // 权限方法
Vue.prototype.water = 'http://localhost:8080/waterOperation'

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
