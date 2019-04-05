import Page from './component/page.vue'
import PercentCompleted from './component/percentCompleted.vue'
import Banner from './component/banner.vue'
import BannerDocument from './component/bannerDocument.vue'
import NavTitle from './component/navTitle.vue'
import './common/css/font/iconfont'
export default {
  install(Vue, options = {}) {
    Vue.component(Page.name, Page)
    Vue.component(PercentCompleted.name, PercentCompleted)
    Vue.component(Banner.name, Banner)
    Vue.component(BannerDocument.name, BannerDocument)
    Vue.component(NavTitle.name, NavTitle)
  }
}