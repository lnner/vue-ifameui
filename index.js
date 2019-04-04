import Page from './ifameui/page.vue'
import PercentCompleted from './ifameui/percentCompleted.vue'
import Banner from './ifameui/banner.vue'
import PercentCompleted from './ifameui/percentCompleted.vue'
import BannerDocument from './ifameui/bannerDocument.vue'
import NavTitle from './ifameui/navTitle.vue'

export default {
  install(Vue, options = {}) {
    Vue.component(Page.name, Page)
    Vue.component(PercentCompleted.name, PercentCompleted)
    Vue.component(Banner.name, Banner)
    Vue.component(BannerDocument.name, BannerDocument)
    Vue.component(NavTitle.name, NavTitle)
  }
}
