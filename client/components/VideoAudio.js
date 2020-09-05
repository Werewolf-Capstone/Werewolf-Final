import React, {useState, useEffect, useRef} from 'react'
import * as faceapi from 'face-api.js'

const VideoAudio = ({participant, shouldWePlay, isLocal}) => {
  const videoRef = useRef()
  const audioRef = useRef()
  const canvasRef = useRef()
  let results = []
  async function getFace(localVideo, options) {
    results = await faceapi.mtcnn(localVideo, options)
  }
  const handlePlaying = () => {
    let ctx = canvasRef.current.getContext('2d')
    let image = new Image()
    image.src = './werewolf.png'

    const mtcnnForwardParams = {
      minFaceSize: 100,
    }
    if (!videoRef.current) return
    console.log('what is videoRef.current111', typeof videoRef.current)
    console.log('what is videoRef.current111', videoRef)

    function step() {
      getFace(videoRef.current, mtcnnForwardParams)
      ctx.drawImage(videoRef.current, 0, 0)
      console.log('resulst are', results)
      results.map((result) => {
        ctx.drawImage(
          image,
          result.detection.box.x + 15,
          result.detection.box.y + 30,
          result.detection.box.width,
          result.detection.box.width * (image.height / image.width)
        )
      })
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const [videoTracks, setVideoTracks] = useState([])
  const [audioTracks, setAudioTracks] = useState([])

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null)

  useEffect(() => {
    if (!participant) return
    setVideoTracks(trackpubsToTracks(participant.videoTracks))
    setAudioTracks(trackpubsToTracks(participant.audioTracks))

    const trackSubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track])
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track])
      }
    }

    const trackUnsubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track))
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track))
      }
    }

    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)

    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant])

  useEffect(() => {
    const faceapiWrapper = async () => {
      await faceapi.loadMtcnnModel('./weights')
      await faceapi.loadFaceRecognitionModel('./weights')
    }

    faceapiWrapper()

    const streamConstraints = {audio: true, video: true}

    let isCaller = true
  }, [videoRef.current])

  useEffect(() => {
    console.log('MAKING IT INTO VIDEO TRACK ATTACH?!?!?!?')
    const videoTrack = videoTracks[0]
    if (videoTrack) {
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach()
      }
    }
  }, [videoTracks])

  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioTrack) {
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach()
      }
    }
  }, [audioTracks])

  return (
    <div id="cr">
      <canvas
        id="localCanvas"
        width="400"
        height="400"
        ref={canvasRef}
      ></canvas>
      <video
        style={{
          height: '10rem',
          borderStyle: 'solid',
          borderRadius: '25%',
        }}
        ref={videoRef}
        autoPlay={shouldWePlay}
        muted={isLocal}
        onPlaying={(e) => handlePlaying(e)}
        // onPlay={() => handlePlaying(e)}
        // onWaiting={() => handlePlaying(e)}
        // onError={() => handlePlaying(e)}
        // onClick= {handlePlaying}
      />
      <audio ref={audioRef} autoPlay={shouldWePlay} muted={!isLocal} />
    </div>
  )
}

export default VideoAudio
