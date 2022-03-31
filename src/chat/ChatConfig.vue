<template>
  <el-row justify="center" style="font-size: var(--el-font-size-extra-large); margin: 1em">
    请输入房间信息
  </el-row>

  <el-row justify="center">
    <el-input v-model="input" placeholder="加入房间URL或创建房间密码" style="max-width: 500px" />
  </el-row>
  <div style="margin: 1em"></div>
  <el-row justify="center" style="margin: 1.2em">
    <el-button type="primary" plain @click="onSubmit">加入/创建房间</el-button>
  </el-row>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
const self = getCurrentInstance()!.appContext.config
  .globalProperties as import('../utils/GlobalProperties').GlobalProperties

const input = ''
const onSubmit = async () => {
  const QueryArray = input.match(/roomID=([a-zA-Z0-9]{8})&key=([a-zA-Z0-9]{8})$/g)
  if (QueryArray === null) {
    self.$pop('正在创建房间')
    const resposne = await fetch(`http://localhost:8000/create?key=${input}`)
    const json = await resposne.json()
    self.$store.room_id = json.room_id as string
    self.$store.key = input
  } else {
    self.$pop('正在加入房间' + QueryArray[0])
    self.$store.room_id = QueryArray[0]
    self.$store.key = QueryArray[1]
  }
  openVoice().then(openThen)
}

const openVoice = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (error) {
    console.log('openScreen: ' + error)
    self.$pop('打开麦克风失败！')
  }
}

const openThen = (stream: MediaStream | undefined) => {
  const handleNegotiationNeeded = async () => {
    console.log('Creating Offer')
    try {
      const myoffer = await self.$Voice.peerRef!.createOffer()
      await self.$Voice.peerRef!.setLocalDescription(myoffer)

      websocketRef.send(JSON.stringify({ offer: self.$Voice.peerRef!.localDescription }))
    } catch (err) {
      console.log('handleNegotiationNeeded: ' + err)
    }
  }

  const handleIceCandidateEvent = (event: any) => {
    console.log('Found Ice Candidate')
    if (event.candidate) {
      console.log(event.candidate)
      websocketRef.send(JSON.stringify({ iceCandidate: event.candidate }))
    }
  }

  const handlerTrackEvent = (event: any) => {
    console.log('Received Tracks')
    self.$Voice.ref.srcObject = event.streams[0]
  }

  const createPeer = () => {
    console.log('Creating Peer Connection')
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }]
    })
    peer.onnegotiationneeded = handleNegotiationNeeded
    peer.onicecandidate = handleIceCandidateEvent
    peer.ontrack = handlerTrackEvent
    return peer
  }

  const callUser = () => {
    console.log('Calling Other Over...')
    self.$Voice.peerRef = createPeer()
    self.$Voice.userStream!.getTracks().forEach((track) => {
      self.$Voice.peerRef!.addTrack(track, self.$Voice.userStream!)
    })
    console.log(JSON.stringify(self.$Voice.peerRef!))
  }

  const handleOffer = async (offer: any) => {
    console.log('Received Offer, Creating Answer')
    self.$Voice.peerRef! = createPeer()

    await self.$Voice.peerRef!.setRemoteDescription(new RTCSessionDescription(offer))

    self.$Voice.userStream!.getTracks().forEach((track) => {
      self.$Voice.peerRef!.addTrack(track, self.$Voice.userStream!)
    })

    const answer = await self.$Voice.peerRef!.createAnswer()
    await self.$Voice.peerRef!.setLocalDescription(answer)

    websocketRef.send(JSON.stringify({ answer: self.$Voice.peerRef!.localDescription }))
  }

  self.$Voice.userStream = stream
  self.$Voice.ref.srcObject = stream!

  const websocketRef = (self.$Voice.websocketRef = new WebSocket(
    `ws://localhost:8000/join?roomID=${self.$store.room_id}&key=${self.$store.key}`
  ))
  websocketRef.addEventListener('open', () => {
    websocketRef.send(JSON.stringify({ join: true }))
  })

  websocketRef.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data)
    console.log(message)

    if (message.join) {
      callUser()
    }

    if (message.offer) {
      handleOffer(message.offer)
    }

    if (message.answer) {
      console.log('Receiving Answer')
      self.$Voice.peerRef!.setRemoteDescription(new RTCSessionDescription(message.answer))
    }

    if (message.iceCandidate) {
      console.log('Receving and Adding ICE Canadidate')
      try {
        await self.$Voice.peerRef!.addIceCandidate(message.iceCandidate)
      } catch (error) {
        console.log('Error Receiving ICE Candidate', error)
        self.$pop('通话失败！')
      }
    }
  })

  websocketRef.addEventListener('close', (event: any) => {
    const message = JSON.parse(event.data)
    console.log('Close: ' + message)
    self.$pop('结束通话！')
  })
}
</script>
