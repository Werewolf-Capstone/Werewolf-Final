/* eslint-disable complexity */
import React, {useState, useCallback} from 'react'
import Lobby from './Lobby'
import Room from './Room'
import {db} from './firebase'

const VideoChat = () => {
  const roomObj = {
    Night: true,
    checkMajority: false,
    checkMedic: false,
    checkSeer: false,
    checkWerewolf: false,
    dead: [],
    gameStarted: false,
    gameOver: false,
    medic: '',
    medicChoice: '',
    players: [],
    seer: '',
    seerChoice: '',
    villagers: [],
    villagersChoice: '',
    votesVillagers: [],
    votesWerewolves: [],
    votesWerewolvesColors: [],
    werewolvesChoice: '',
    werewolves: [],
  }

  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')
  const [token, setToken] = useState(null)

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
      setToken(data.token)

      db.collection('rooms')
        .doc(roomName)
        .get()
        .then(async (snapshot) => {
          if (snapshot.exists) {
            const players = await snapshot.get('players')
            const gameStarted = await snapshot.get('gameStarted')
            const gameOver = await snapshot.get('gameOver')
            if (!players.length) {
              //if room exists and no one is in it
              db.collection('rooms').doc(roomName).set(roomObj, {merge: true})
            } else if (players.length && !gameStarted) {
              //if room exists and ppl are in it but it has not started
              //do nothing
            } else if (players.length && gameStarted && !gameOver) {
              //if room exists and ppl are in it and it has started but not over
              //do nothing
            } else if (players.length && gameStarted && gameOver) {
              //if room exists and ppl are in it and it has started but it is over
              db.collection('rooms').doc(roomName).set(roomObj)
            }
          } else {
            //if room does not exist
            db.collection('rooms').doc(roomName).set(roomObj)
          }
        })
    },
    [roomName, username]
  )

  const handleLogout = useCallback((event) => {
    setToken(null)
  }, [])

  let render
  if (token) {
    render = (
      <Room roomName={roomName} token={token} handleLogout={handleLogout} />
    )
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
    )
  }
  return render
}

export default VideoChat
