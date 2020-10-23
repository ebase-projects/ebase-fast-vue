<template>
  <div class="notice-read">
    <svg-icon icon-class="unreadMessage" @click="click" />
    <span class="icon-count">{{ $store.state.notice.unreadCount }}</span>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'NoticeRead',
  data() {
    return {
      websock: undefined,
      noticeNotReadCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'notice'
    ])
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
    },
    initWebSocket() { // 初始化weosocket
      // const baseWebsocketURL = process.env.VUE_APP_BASE_WS

      // ws://localhost:8080/websocket?access_token=54c03f71-685a-4d7c-ac06-7494003a0be5
      // const wsuri = 'ws:127.0.0.1:8080' + `/websocket?access_token=${getToken()}`
      // const wsuri = window.location.protocol + '//' + window.location.host + `/ws/websocket?access_token=${getToken()}`
      const wsuri = 'ws:' + window.location.host + `/ws/websocket?access_token=${getToken()}`
      // const wsuri = baseWebsocketURL + `/websocket?access_token=${getToken()}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      console.log('===连接建立===')
      this.notReadCount()
      // const actions = { 'test': '12345' }
      // this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      console.log('===数据接收===')
      const redata = JSON.parse(e.data)
      console.log(redata)
      this.notReadCount()
    },
    websocketsend(data) { // 数据发送
      this.websock.send(data)
    },
    websocketclose(e) { // 关闭
      console.log('===断开连接===')
      console.log('断开连接', e)
    },
    notReadCount() {
      // notReadCount().then(response => {
      //   this.noticeNotReadCount = response.data
      // })

      this.$store.dispatch('notice/getUnreadCount')
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}

.notice-read {
  position: relative;
}

.icon-count {
  min-width: 14px;
  text-align: center;
  line-height: 14px;
  display: inline-block;
  position: absolute;
  right: -5px;
  top: 4px;
  background: red;
  color: #fff;
  border-radius: 17px;
  padding: 4px;
  font-size: 14px;
  -webkit-transform: scale(.7);
  transform: scale(.7);
  font-family: Tahoma !important;
}
</style>
