<template>
  <div class="navMain">
    <ul ref="navTitleUl">
      <li ref='navTitleLi'
          :class="{color:indexBefore==index}"
          v-for="(item,index) in msg"
          :key="`nav_${index}_${item.name}`"
          @mouseenter='navME(index)'
          @click.stop='navC(index,item.id)'
          @mouseleave='navME(indexBefore)'
          >
        <router-link tag="span"
                     v-if="routerlink"
                     :to='{name:item.link,query:{key:(item.parameter)?item.parameter:undefined},params:{id:item.id?item.id:null}}'
                     style='height:100%;width:100%;display:inline-block;'
                     v-text="item.name">
        </router-link>
        <span v-text="item.name"
              v-else></span>
      </li>
    </ul>
    <span class='line'
          ref='navTitleLine'></span>
  </div>
</template>

<script>
// import  from '';
export default {
  name:'NavTitle',
  props: {
    msg: {
      type: Array,
      default: function () {
        return [{
          name: 'xxx',
          link: 'yyy',
          parameter: 'zzz',
          id: 99
        }]
      },
    },
    routerlink: {
      type: Boolean,
      default: true,
      required: false
    },
    navTitleIndex: {//滑块初始位置
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      indexBefore: 0,
    };
  },
  watch: {
    msg: {
      handler (val) {
        if (!this.routerlink) this.$emit('navTitleIndex', this.indexBefore);
        this.$nextTick(() => {
          this.navME(this.indexBefore);
        })
      },
      immediate: true,
      deep: true
    },
    navTitleIndex: {
      handler (val) {
        this.indexBefore = val;
        this.$nextTick(() => {
          this.navME(this.indexBefore);
        })
      }, immediate: true,
    }
  },
  mounted () { },
  methods: {
    navME (index) {
      let left = $(this.$refs.navTitleUl)
        .children("li")
        .eq(index)
        .position().left;
      let lineWidth = $(this.$refs.navTitleUl)
        .children("li")
        .eq(index)
        .width();
      $(this.$refs.navTitleLine)
        .stop(true, false)
        .animate({
          left: left,
          width: lineWidth
        },
          200
        );
    },
    navC (index, id) {
      this.indexBefore = index;

      if (!this.routerlink) {
        this.$emit('navTitleIndex', index);
        this.$emit('navTitleId', id);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.navMain {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  position: relative;
  .color {
    color: #2f9dea !important;
  }
  ul {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    li {
      height: 100%;
      color: #464c5b;
      span {
        font-size: 14px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          color: #2f9dea;
        }
      }
    }
  }
  .line {
    display: inline-block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 56px;
    border-radius: 50px;
    background: #2f9dea;
  }
}
</style>