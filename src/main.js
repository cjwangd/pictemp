import PicTemp from './PicTemp'
import _Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

// 这一步判断window.Vue是否存在，因为直接引用vue.min.js， 它会把Vue绑到Window上，我们直接引用打包好的js才能正常跑起来。
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('pic-template', PicTemp)
}
//这样就可以使用Vue.use进行全局安装了。
PicTemp.install = Vue => {

  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(PicTemp.name, PicTemp)
}
Vue.config.productionTip=false;
Vue.use(VueAwesomeSwiper);
export default PicTemp;
export  {PicTemp};
