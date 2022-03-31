import { Router } from 'vue-router'
import { StoryMap } from '../story/Story'

class AudioBase {
  public currentTime = -1
  constructor(public ref: HTMLAudioElement) {}
}

export class VoiceAudio extends AudioBase {
  public userStream?: MediaStream
  public websocketRef?: WebSocket
  public peerRef?: RTCPeerConnection
  constructor() {
    super(document.getElementById('voice') as HTMLAudioElement)
  }
}

export class MusicAudio extends AudioBase {
  constructor() {
    super(document.getElementById('music') as HTMLAudioElement)
  }
}

export interface GlobalProperties {
  $pop: (text: string) => Promise<void>
  $router: Router
  $AMap: Promise<unknown>
  $Music: MusicAudio
  $Voice: VoiceAudio
  $store: {
    userid: number
    markerid: number
    stories: StoryMap
    room_id: string
    key: string
  }
}
