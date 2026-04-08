import { PitchDetector } from 'pitchy'

export interface PitchResult {
  frequency: number
  clarity: number
}

let audioContext: AudioContext | null = null
let analyserNode: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let detector: PitchDetector<Float32Array<ArrayBuffer>> | null = null
let inputBuffer: Float32Array<ArrayBuffer> | null = null

export async function startAudio(): Promise<void> {
  if (audioContext) return

  audioContext = new AudioContext()

  mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  })

  const source = audioContext.createMediaStreamSource(mediaStream)
  analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 4096

  source.connect(analyserNode)

  const bufferLength = analyserNode.fftSize
  inputBuffer = new Float32Array(bufferLength) as Float32Array<ArrayBuffer>
  detector = PitchDetector.forFloat32Array(bufferLength) as PitchDetector<Float32Array<ArrayBuffer>>
}

export function stopAudio(): void {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  analyserNode = null
  detector = null
  inputBuffer = null
}

export function detectPitch(): PitchResult | null {
  if (!analyserNode || !detector || !inputBuffer || !audioContext) {
    return null
  }

  analyserNode.getFloatTimeDomainData(inputBuffer)

  const [frequency, clarity] = detector.findPitch(inputBuffer, audioContext.sampleRate)

  if (clarity < 0.9 || frequency < 60 || frequency > 1200) {
    return null
  }

  return { frequency, clarity }
}

export function isAudioActive(): boolean {
  return audioContext !== null && mediaStream !== null
}
