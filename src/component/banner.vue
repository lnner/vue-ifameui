<template>
  <div class="carousel">
    <div class="box"
         ref="box"
         @mouseenter='_carouselStop'
         @mouseleave='_carouselRun'>
      <div class="inner"
           ref="inner">
        <!-- :style="`background:url(${msg&&msg[0].image}) no-repeat;background-size: 100% 100%;`" -->
        <ul ref="ul"
            class="list_wrapper clearfix">
          <router-link tag='li'
                       v-if='item.dataType==2'
                       :to="{name:'courseCurrent',params:{courseId:item.dataId}}"
                       class="banner_list"
                       v-for='(item,index) in result'
                       :key='`banner_${index}_${item.id}`'>
            <img :src="item.image"
                 :alt="item.title">
          </router-link>
          <router-link tag='li'
                       v-if='item.dataType==1'
                       :to="{name:'courseDetail',params:{courseDetail_id:item.dataId}}"
                       class="banner_list"
                       v-for='(item,index) in result'
                       :key='`banner_${index}_${item.id}`'>
            <img :src="item.image"
                 :alt="item.title">
          </router-link>
        </ul>
        <div class="list clearfix"
             ref='pageList'
             v-if='configDefault.pag'>
          <i :class="{'current':listIndex==(i>=msg.length?0:i)}"
             v-for="(listItem,listIndex) in msg"
             :key="`listI_${listIndex}`"
             @click.stop='i=listIndex-1;waitStart&&_move()'
             @mouseenter='_carouselStop'></i>
        </div>
        <div class="arrow"
             v-if='configDefault.arrow'>
          <span class="arrow-left"
                @click.stop='waitStart&&_prev()'
                @mouseenter='_carouselStop'>&lt;</span>
          <span class="arrow-right"
                @click.stop='waitStart&&_move()'
                @mouseenter='_carouselStop'>&gt;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    configs: {
      type: Object,
      default: function () {
        return {
          ele: "box",
          arrow: false,
          pag: true,
          animation: 3000,
          stop: false,
          attr: 'left'
        }
      }
    },
    msg: {
      type: Array,
      default: () => {
        return [{
          dataId: 1,
          dataType: null,
          id: 1,
          image: "",
          title: "undefined"
        }]
      }
    }
  },
  data () {
    return {
      result: [],
      boxW: null,
      animateTimer: undefined,
      runTimer: undefined,
      resizeTimer: undefined,
      i: 0,
      configDefault: {
        ele: "box",
        arrow: false,
        pag: true,
        animation: 3000,
        stop: false,
        attr: 'left'
      },
      startTime: 0,
      waitStart: true
    }
  },
  watch: {
    configs: {
      handler (val) {
        this.configDefault = Object.assign({},this.configDefault,val);
        // this.configDefault = { ...this.configDefault, ...val };
        clearInterval(this.animateTimer)
        clearInterval(this.runTimer)
        this.$nextTick(() => [
          this.init()
        ])
      },
      immediate: true
    },
    msg: {
      handler (val) {
        let arr = JSON.parse(JSON.stringify(val))
        arr.push(
          this.msg[0]
        )
        this.result = arr
        clearInterval(this.animateTimer)
        clearInterval(this.runTimer)

        this.$nextTick(() => [
          this.init()
        ])
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    window.addEventListener('resize', this.throttles)
    window.addEventListener('visibilitychange', this.stopOrRunF)
  },
  beforeDestroy () {
    clearInterval(this.animateTimer)
    clearInterval(this.runTimer)
    window.removeEventListener('resize', this.throttles)
    window.removeEventListener('visibilitychange', this.stopOrRunF)
  },
  methods: {
    init () {
      if (!this.configDefault.stop) {
        this.startTime = 0
        this._carouselRun()
      }
      this._setStyle()
    },
    stopOrRunF () {
      if (document.hidden) {
        clearInterval(this.animateTimer)
        clearInterval(this.runTimer)
      } else {
        this.init()
      }

    },
    _carouselRun () {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        this._move()
      }, this.configDefault.animation);
    },
    _move () {
      this.i++
      let num = -this.boxW * this.i;
      this._animate(this.$refs.ul, num, this._resets)
    },
    _animate (obj, iTarget, fn) {
      this.waitStart = false;
      this.animateTimer = null
      clearInterval(this.animateTimer)
      let _this = this
      let attr = this.configDefault.attr
      this.animateTimer = setInterval(() => {
        //获取当前值
        let current = 0
        current = parseInt(this.getStyleAttribute(obj, attr))//目前左移的px

        if (current == iTarget) {//往左iTarget为负
          //判断是否达到目标值，达到则停止（鼠标放在轮播图上）
          current = iTarget
          obj.style[this.configDefault.attr] = iTarget
          clearInterval(this.animateTimer)
          if (fn) {
            fn()
          }
          //结束函数
          return
        }
        var reduce = (iTarget - current) / 10 //--为负  逐渐递减，通过除以数的大小（10）来控制一张图片过去的时间，停顿的时间为this.animation减一张图片过去的时间
        reduce = reduce > 0 ? Math.ceil(reduce) : Math.floor(reduce) //根据正负进行取整
        obj.style[this.configDefault.attr] = current + reduce + "px"


      }, 15)
    },
    _setStyle () {
      // let width = this.$refs.box.offsetWidth;
      let width = this.getStyleAttribute(this.$refs.box, 'width');
      this.boxW = width//之后用到
      let ul = this.$refs.box.querySelector("ul"), li = this.$refs.box.querySelectorAll('li')
      let len = this.$refs.box.querySelectorAll('li').length
      for (let i = 0, lenfth = len; i < lenfth; i++) {
        li[i].style.width = width + 'px'
      }
      ul.style.width = width * len + 'px';
      ul.style.left = -this.i * width + 'px'
    },
    _resets () {
      //判断是否轮回
      let ul = this.$refs.box.querySelector("ul"), li = this.$refs.box.querySelectorAll('li')
      if (this.i >= (li.length - 1)) {
        ul.style.left = 0
        this.i = 0
      }
      this.waitStart = true

    },
    _prev () {
      //左点击
      this.i--
      if (this.i < 0) {
        let num = this.msg.length
        this.i = num - 1
        this.$refs.ul.style.left = -num * this.boxW + "px" //重复的图片位置
      }
      let left = -this.boxW * this.i;
      this._animate(this.$refs.ul, left, this._resets)
    },
    throttles (fn) {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this._setStyle()
        this._carouselRun()
      }, 100)
    },
    _carouselStop () {
      clearTimeout(this.runTimer)
    },
    getStyleAttribute (obj, attr) {
      //获取最终样式
      if (obj) {
        if (window.getComputedStyle) {
          return Number(window.getComputedStyle(obj, null).getPropertyValue(attr).split('px')[0])
        }
        return Number(obj.currentStyle(attr).split('px')[0])
      }
    },
    getTime () {
      return new Date().getTime()
    }
  }
}
</script>
<style lang="scss" scoped>
.carousel {
  width: 100%;
  height: 360px;
  position: relative;
  overflow: hidden;
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 360px;
    .inner {
      position: relative;
      overflow: hidden;
      height: 100%;
      width: 100%;
      ul {
        width: 700%;
        height: 100%;
        position: absolute;
        left: 0;
        li {
          float: left;
          height: 100%;
          cursor: pointer;
          &:nth-of-type(2) {
            background: pink;
          }
          a,
          img {
            display: block;
            width: 100%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: auto 100%;
          }
        }
      }
      .list {
        position: absolute;
        bottom: 20px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        i {
          width: 22px;
          height: 5px;
          border-radius: 5px;
          background-color: #ececec;
          color: #333;
          float: left;
          font-style: normal;
          text-align: center;
          margin-right: 10px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
        .current {
          background-color: skyblue;
          color: #fff;
        }
      }
      .arrow {
        position: absolute;
        width: 100%;
        top: 50%;
        margin-top: -30px;
        .arrow-left,
        .arrow-right {
          width: 30px;
          height: 60px;
          position: absolute;
          font: 20px/60px "consolas";
          color: #fff;
          background-color: rgba(0, 0, 0, 0.3);
          text-align: center;
          cursor: pointer;
        }
        .arrow-right {
          right: 0;
        }
      }
    }
  }
}
</style>