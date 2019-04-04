import Page from './page.vue'
import PercentCompleted from './percentCompleted.vue'
import Banner from './banner.vue'
import PercentCompleted from './percentCompleted.vue'
import BannerDocument from './bannerDocument.vue'
import NavTitle from './navTitle.vue'

export default {
  install(Vue, options = {}) {
    Vue.component(Page.name, Page)
    Vue.component(PercentCompleted.name, PercentCompleted)
    Vue.component(Banner.name, Banner)
    Vue.component(BannerDocument.name, BannerDocument)
    Vue.component(NavTitle.name, NavTitle)
  }
}
