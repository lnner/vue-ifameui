<template>
  <div class="carousel">
    <div class="box"
         ref="box">
      <div class="inner"
           ref="inner">
        <ul ref="ul"
            class="list_wrapper clearfix">
          <li class="banner_list"
              v-for='(item,index) in result'
              :key='`banner_${index}`'>
            <img :src="item.contentUrl"
                 v-if='item'>
          </li>
        </ul>
        <div class="listInputBox">
          <div class="listInput">
            <span class='pageIn'
                  v-if='configDefault.arrow'
                  @mousedown.stop='waitStart&&_prev()'>上一页</span>
            <input type="number"
                   v-model="num"
                   @keydown.13='numSendF'
                   @input='numF'>
            <span>/{{configs.total}}</span>
            <span class='pageIn'
                  v-if='configDefault.arrow'
                  @mousedown.stop='waitStart&&_move()'>下一页</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerDocument',
  props: {
    configs: {
      type: Object,
      default: function () {
        return {
          total: 1,
          page: 0,
          size: 0
        }
      }
    },
    msg: {
      type: Object,
      default: function () {
        return {
          numberOfElements: 0,
          content: [{
            id: 1,
            contentUrl: "",
          }],
        }
      }
    }
  },
  data () {
    return {
      result: [],
      boxW: null,
      animateTimer: undefined,
      resizeTimer: undefined,
      i: 0,
      configDefault: {
        arrow: true,
        pag: true,
        animation: 3000,//自动播放时用到
        stop: true,
        attr: 'left'
      },
      startTime: 0,
      waitStart: true,
      num: 1,
      iReduceChange: true,
      iAddChange: true,
      iInput: true,
    }
  },
  watch: {
    msg: {
      handler (val) {
        let page = Math.floor((this.num - 1) / 10);
        for (let i = 0, len = val.numberOfElements; i < len; i++) {
          const ele = val.content[i];
          // console.log('------------page * 10 + i', page * 10 + i);
          this.$set(this.result, page * 10 + i, ele)
        }
        // console.log('------------this.result', this.result);

        this.result[this.configs.total] = val[0]
        clearInterval(this.animateTimer)
        this.$nextTick(() => {
          if (!this.iReduceChange) {
            this.iReduceChange = true;
            this._prev()
          }
          if (!this.iAddChange) {
            this.iAddChange = true
            this._move()
          }
          if (!this.iInput) {
            this.iInput = true
            this.numSendF();
          }
          this.init()
        })
      }, deep: true
    },
  },
  created () {
  },
  mounted () {
    this.i = Number(this.$cookies.get('pageDocument')) || 0
    this.num = this.i + 1
    this.$emit('pageDocument', this.num)
    window.addEventListener('resize', this.throttles)
    window.addEventListener('visibilitychange', this.visibilitychange)
  },
  beforeDestroy () {
    clearInterval(this.animateTimer)
    window.removeEventListener('resize', this.throttles)
    window.removeEventListener('visibilitychange', this.visibilitychange)
  },
  methods: {
    init () {
      this._setStyle()
    },
    _prev () {//上一页
      let num = this.configs.total
      let iReduce = this.i - 1;
      this.waitStart = false;
      if ((iReduce < 0) && !this.result[num - 1]) {
        this.num = num
        this.iReduceChange = false;
        this.$emit('pageDocument', this.num)
        return
      } else if ((iReduce >= 0) && !this.result[iReduce]) {
        this.num = this.i
        this.iReduceChange = false;
        this.$emit('pageDocument', this.num)
        return
      }
      this.i--
      if (this.i < 0) {
        this.i = num - 1
        this.num = num
        this.$refs.ul.style.left = -num * this.boxW + "px" //重复的图片位置
      }
      let left = -this.boxW * this.i;
      this._animate(this.$refs.ul, left, this._resets)
      this.num = this.i + 1;
    },
    _move () {//下一页
      let iAdd = this.i + 1;
      this.waitStart = false;
      if (iAdd == this.configs.total && !this.result[0]) {
        this.num = 1;
        this.iAddChange = false;
        this.$emit('pageDocument', this.num)
        return
      } else if (iAdd < this.configs.total && !this.result[iAdd]) {
        this.num = iAdd + 1
        this.iAddChange = false;
        this.$emit('pageDocument', this.num)
        return
      }

      this.i++
      let left = -this.boxW * this.i;
      if (this.i > (this.configs.total - 1)) {
        this.num = 1
      } else {
        this.num = this.i + 1
      }
      this._animate(this.$refs.ul, left, this._resets)
    },
    numSendF () {//输入页数时
      this.waitStart = false;
      console.log('------------', this.num);
      if (this.result[this.num - 1]) {
        this.i = this.num - 1;
        console.log('------------this.i', this.i);
        let left = -this.boxW * this.i;
        this._animate(this.$refs.ul, left, this._resets)
      } else {
        this.iInput = false;
        this.$emit('pageDocument', this.num - 1)
      }
    },
    _animate (obj, iTarget, fn) {//动画效果
      this.waitStart = false;
      this.animateTimer = null
      clearInterval(this.animateTimer)
      let _this = this
      let attr = this.configDefault.attr
      this.animateTimer = setInterval(() => {
        //获取当前值
        let current = 0
        current = parseInt(this.getStyleAttribute(obj, attr))//目前左移的px
        this.$nextTick(() => {
          if (current == iTarget) {//往左iTarget为负
            //判断是否达到目标值，达到则停止（鼠标放在轮播图上）
            current = iTarget
            obj.style[this.configDefault.attr] = iTarget
            clearInterval(this.animateTimer)
            if (fn) {
              this.$nextTick(() => {
                fn()
              })
            }
            //结束函数
            return
          }        })

        var reduce = (iTarget - current) / 10 //--为负  逐渐递减，通过除以数的大小（10）来控制一张图片过去的时间，停顿的时间为this.animation减一张图片过去的时间
        reduce = reduce > 0 ? Math.ceil(reduce) : Math.floor(reduce) //根据正负进行取整
        obj.style[this.configDefault.attr] = current + reduce + "px"
      }, 15)
    },
    _setStyle () {//保持宽度的调整
      let width = this.getStyleAttribute(this.$refs.box, 'width');
      // let width = this.$refs.box.offsetWidth;
      this.boxW = width//之后用到
      let ul = this.$refs.box.querySelector("ul"), li = this.$refs.box.querySelectorAll('li')
      let len = this.$refs.box.querySelectorAll('li').length
      for (let i = 0; i < len; i++) {
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
    throttles (fn) {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this._setStyle()
      }, 100)
    },
    getStyleAttribute (obj, attr) {//获取最终样式
      if (window.getComputedStyle) {
        return Number(window.getComputedStyle(obj, null).getPropertyValue(attr).split('px')[0])
      }
      return Number(obj.currentStyle(attr).split('px')[0])
    },
    getTime () {
      return new Date().getTime()
    },
    numF () {
      if (this.num > this.configs.total) {
        this.num = this.configs.total
      } else if (this.num < 1) {
        this.num = 1
      }
    },
    visibilitychange () {
      if (document.hidden) {
        clearInterval(this.animateTimer)
      } else {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.carousel {
  width: 100%;
  height: 480px;
  position: relative;
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
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
          background: #fff;
          img {
            display: block;
            max-width: 100%;
            max-height: 100%;
            margin: auto;
            background-position: center;
            background-repeat: no-repeat;
            background-size: auto 100%;
          }
        }
      }
      .listInputBox {
        width: 100%;
        position: absolute;
        bottom: 0px;
        // bottom: -50px;
        height: 30px;
        padding: 10px 0;
        overflow: hidden;
        user-select: none;
        box-sizing: content-box;
        background: rgba(0, 0, 0, 0.1);
        opacity: 0.6;
        transition: all 0.3s;
        &:hover {
          opacity: 1;
        }
        .listInput {
          white-space: nowrap;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          input {
            width: 50px;
            height: 30px;
            padding: 5px 10px;
            box-sizing: border-box;
            text-align: center;
          }
          .pageIn {
            margin: 0 10px;
            cursor: pointer;
            &:hover {
              color: #32abff;
            }
          }
        }
      }
    }
  }
}
</style>