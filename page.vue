<template>
  <div class="main">
    <span class="pageAll">共计&nbsp;{{msg.pageNum || 0}}&nbsp;条</span>
    <!-- <i>{{previous}}||</i> -->
    <!-- <i>{{pageNumIndex}}</i> -->
    <div class="pageContent">
      <!-- <span class="start">首页</span> -->
      <i class="iconfont icon-zuojiantou"
         @click.stop="previous<2?null:--previous;pageNumIndex&&(previous<msg.pageTotal-3)?--pageNumIndex:null;"></i>
      <div class="pageNum">
        <i :class="{select:previous==1}"
           @click.stop="pageNumIndex=0;previous=1">1</i>
        <i v-if="pageNumIndex"
           @click.stop="pageNumIndex=pageNumIndex>4?pageNumIndex-5:0;previous=4+pageNumIndex;"
           class="more">
          <span class="iconfont icon-more"></span>
          <span class="iconfont icon-leftDouble"></span>
        </i>

        <i :class="{select:previous==(2+pageNumIndex)}"
           @click.stop="previous=2+pageNumIndex;pageNumIndex=(pageNumIndex>1?pageNumIndex-2:(pageNumIndex-1==0?pageNumIndex-1:pageNumIndex));"
           v-if="msg.pageTotal>1">{{2+pageNumIndex}}</i>

        <i :class="{select:previous==(3+pageNumIndex)}"
           @click.stop="previous=3+pageNumIndex;pageNumIndex=(pageNumIndex?pageNumIndex-1:pageNumIndex);"
           v-if="msg.pageTotal>2">{{3+pageNumIndex}}</i>

        <!-- 坐标 -->
        <i :class="{select:previous==(4+pageNumIndex)}"
           v-if="msg.pageTotal>3"
           @click.stop="previous=4+pageNumIndex;">{{4+pageNumIndex}}</i>
        <!-- 坐标 -->

        <i :class="{select:previous==(5+pageNumIndex)}"
           @click.stop="previous=5+pageNumIndex;pageNumIndex=((5+pageNumIndex<msg.pageTotal-2)?pageNumIndex+1:pageNumIndex);"
           v-if="msg.pageTotal>4">{{5+pageNumIndex}}</i>

        <i :class="{select:previous==(6+pageNumIndex)}"
           @click.stop="previous=6+pageNumIndex;pageNumIndex=(msg.pageTotal>7&&(6+pageNumIndex<msg.pageTotal-2)?pageNumIndex+2:((6+pageNumIndex)==(msg.pageTotal-2)?pageNumIndex+1:pageNumIndex))"
           v-if="msg.pageTotal>5">{{6+pageNumIndex}}</i>

        <i v-if="(pageNumIndex+6)<(msg.pageTotal-1)"
           class="more"
           @click.stop="pageNumIndex=(6+pageNumIndex+5)<msg.pageTotal?pageNumIndex+5:(msg.pageTotal-7);previous=4+pageNumIndex;">
          <span class="iconfont icon-more"></span>
          <span class="iconfont icon-rightDouble"></span>
        </i>
        <i :class="{select:previous==msg.pageTotal}"
           v-text="msg.pageTotal"
           v-if="msg.pageTotal>6"
           @click.stop="previous=msg.pageTotal;pageNumIndex=msg.pageTotal-7"></i>
      </div>
      <i class="iconfont icon-youjiantou"
         @click.stop="previous>=msg.pageTotal?null:++previous;(previous>4)&&(previous<msg.pageTotal-2)?++pageNumIndex:null;"></i>
      <!-- pageNumIndex<msg.pageTotal-7 -->
      <!-- <span class="end">尾页</span> -->
    </div>
  </div>
</template>

<script>
// import  from '';
export default {
  name: 'Page',
  props: {
    msg: {
      type: Object,
      default: () => {
        return {
          pageCurrent: 0,//当前页
          pageNum: 0,//总数量
          pageTotal: 1//总页数
        }
      }
    }
  },
  data () {
    return {
      result: undefined,
      pageNumIndex: 0,//增加数
      previous: 1,//上一次的点击数
    }
  },
  watch: {
    'msg.pageCurrent': {
      handler (val) {
        this.previous = val + 1;
      },
      immediate: true
    },
    previous: {
      handler (val) {
        this.$emit('pageCurrent', val - 1)
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  user-select: none;
  text-align: center;
  color: #999;
  span,
  i {
    font-size: 14px;
    vertical-align: middle;
  }
  .pageContent {
    display: inline-block;
    i {
      &:hover {
        color: #32abff;
      }
    }
    .icon-zuojiantou,
    .icon-youjiantou {
      width: 30px;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      text-align: center;
    }
    .pageNum {
      display: inline-block;
      i {
        font-style: initial;
        font-size: 14px;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        text-align: center;
        &:nth-last-of-type(1) {
          margin: 0;
        }
      }
      .more {
        .icon-leftDouble,
        .icon-rightDouble {
          display: none;
          font-size: 12px;
        }
        &:hover {
          .icon-leftDouble,
          .icon-rightDouble {
            display: inline-block;
          }
          .icon-more {
            display: none;
          }
        }
      }
      .select {
        color: #32abff;
      }
    }
  }
  .pageAll {
    margin-left: 20px;
    margin-right: 10px;
  }
}
</style>