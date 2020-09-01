import React, {useState, useEffect} from 'react'
import Video from 'twilio-video'
import Participant from './Participant'
import {db} from './firebase'

const Room = ({roomName, token, handleLogout}) => {
  const [stateRoom, setStateRoom] = useState(null)
  const [participants, setParticipants] = useState([])

  // potentially needed game logic state
  const [night, setNight] = useState(true)
  const [localRole, setLocalRole] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [checkWerewolf, setCheckWerewolf] = useState(false)
  const [checkSeer, setCheckSeer] = useState(false)
  const [checkMedic, setCheckMedic] = useState(false)
  const [werewolfChoice, setWerewolfChoice] = useState(false)
  const [didSeerHit, setDidSeerHit] = useState(false)
}

export default Room
