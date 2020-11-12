import React, {useState, useEffect, useRef} from 'react'

/**
 * @summary Using Twilio functions to initiate A/V capabilities and load them into a div
 * Much of this code was made using the Twilio tutorial available on their blog.
 */
const VideoAudio = ({participant, shouldWePlay, isLocal}) => {
  //creating state refs and hooks
  const videoRef = useRef()
  const audioRef = useRef()
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

  // attach video stream to video ref (which points to the video tag)
  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (videoTrack) {
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach()
      }
    }
  }, [videoTracks])

  // attach audio stream to audio ref (which points to the audio tag)
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
    <div>
      <video
        style={{
          width: '200px',
          borderStyle: 'solid',
          borderRadius: '25%',
        }}
        ref={videoRef}
        autoPlay={shouldWePlay}
        muted={isLocal}
      />
      <audio ref={audioRef} autoPlay={shouldWePlay} muted={!isLocal} />
    </div>
  )
}

export default VideoAudio
