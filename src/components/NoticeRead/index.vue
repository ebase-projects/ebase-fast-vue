<template>
  <div>
    <el-badge :value="$store.state.notice.unreadCount">
      <svg-icon icon-class="unreadMessage" @click="click" />
    </el-badge>

  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'NoticeRead',
  data() {
    return {
      stompClient: '',
      timer: '',
      noticeNotReadCount: 0,
      number: 1
    }
  },
  computed: {
    ...mapGetters([
      'notice'
    ])
  },
  created() {
    this.notReadCount()
    this.initWebSocket()
  },
  beforeDestroy: function() {
    // 页面离开时断开连接,清除定时器
    this.disconnect()
    clearInterval(this.timer)
  },
  methods: {
    click() {
      // 跳转到我的通知页面
      this.$router.push({
        path: '/Notice/MyNotice'

      })
    },
    initWebSocket() {
      this.connection()
      // const that = this
      // // 断开重连机制,尝试发送消息,捕获异常发生时重连
      // this.timer = setInterval(() => {
      //   try {
      //     that.stompClient.send('/message/heartbeat')
      //   } catch (err) {
      //     console.log('断线了: ' + err)
      //     that.connection()
      //   }
      // }, 5000)
    },
    connection() {
      // const baseWebsocketURL = process.env.VUE_APP_BASE_WS
      // ws://localhost:8080/websocket?access_token=54c03f71-685a-4d7c-ac06-7494003a0be5
      // const wsuri = 'ws:127.0.0.1:8080' + `/websocket?access_token=${getToken()}`
      // const wsuri = window.location.protocol + '//' + window.location.host + `/ws/websocket?access_token=${getToken()}`

      // const wsuri = 'ws:' + window.location.host + `/ws/websocket?access_token=${getToken()}`
      // const wsuri = baseWebsocketURL + `/websocket?access_token=${getToken()}`

      const wsUri = window.location.protocol + '//' + window.location.host + `/ws/websocket?access_token=${getToken()}`
      // 建立连接对象
      const socket = new SockJS(wsUri)
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket)
      // 去掉websocket日志
      // this.stompClient.debug = null
      // 定义客户端的认证信息,按需求配置
      const headers = {
        // 'content-type': 'application/json;charset=UTF-8',
        // Authorization: 'Bearer ' + getToken()
      }
      // 向服务器发起websocket连接
      this.stompClient.connect(headers, () => {
        this.stompClient.subscribe('/topic/notice', (msg) => { // 订阅服务端提供的某个topic
          console.log('/topic/notice广播成功')
          console.log(msg) // msg.body存放的是服务端发送给我们的信息
          console.log(msg.body) // msg.body存放的是服务端发送给我们的信息
          this.notReadCount()
        }, headers)
        this.stompClient.subscribe('/user/topic/notice', (msg) => { // 订阅服务端提供的某个topic
          console.log('/user/topic/notice广播成功')
          console.log(msg) // msg.body存放的是服务端发送给我们的信息
          console.log(msg.body) // msg.body存放的是服务端发送给我们的信息
          this.notReadCount()
        }, headers)
        // this.stompClient.send('/app/chat.addUser',
        //   headers,
        //   JSON.stringify({ sender: '', chatType: 'JOIN' })
        // ) // 用户加入接口
      }, (err) => {
        // 连接发生错误时的处理函数
        console.log('失败')
        console.log('error', err)
        // 连接失败时再次调用函数
        this.number += 1
        if (this.number <= 10) {
          this.connection()
        }
      })
    }, // 连接 后台
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    }, // 断开连接

    notReadCount() {
      this.$store.dispatch('notice/getUnreadCount')
    }
  }

}
</script>

<style scoped>
>>> .el-badge__content.is-fixed {
  top: 10px;
}

</style>
