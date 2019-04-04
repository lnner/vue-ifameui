<template>
  <div class="fileNameBox"
       v-if='msg.fileName'>
    <span class='fileName'>{{msg.fileName}}</span>
    <span>({{msg.fileSize}})</span>
    <div class="progressBox">
      <div class="progress"
           :style='`width:${msg.percentCompleted}%`'></div>
    </div>
    <span>{{msg.percentCompleted}}%</span>
  </div>

</template>

<script>
// import  from '';
export default {
  name: 'PercentCompleted',
  props: {
    msg: {
      type: Object,
      default: () => {
        return {
          fileName: undefined,
          percentCompleted: 0,
          fileSize: null,
        }
      }
    }
  },
  data () {
    return {
      result: undefined
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
.fileNameBox {
  display: inline-block;
  vertical-align: middle;
  span,
  .progressBox {
    vertical-align: middle;
    margin-left: 14px;
    display: inline-block;
  }
  .progressBox {
    width: 110px;
    height: 10px;
    box-sizing: border-box;
    border: 1px solid #dbf0ff;
    .progress {
      width: 0;
      height: 100%;
      background: #32abff;
    }
  }
}
</style>