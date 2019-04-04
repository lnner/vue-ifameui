import Page from './node_modules/page.vue'
import PercentCompleted from './node_modules/percentCompleted.vue'
import Banner from './node_modules/banner.vue'
import PercentCompleted from './node_modules/percentCompleted.vue'
import BannerDocument from './node_modules/bannerDocument.vue'
import NavTitle from './node_modules/navTitle.vue'

export default {
  install(Vue, options = {}) {
    Vue.component(Page.name, Page)
    Vue.component(PercentCompleted.name, PercentCompleted)
    Vue.component(Banner.name, Banner)
    Vue.component(BannerDocument.name, BannerDocument)
    Vue.component(NavTitle.name, NavTitle)
  }
}
