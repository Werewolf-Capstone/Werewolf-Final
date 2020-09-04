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
    colors: ["red", "orange", "pink", "purple", "green", "brown", "blue", "yellow"],
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

      /**
       * Logic to either add players to the correct game, or to create a new game if the old one is over
       */
      db.collection('rooms')
        .doc(roomName)
        .get()
        .then(async (snapshot) => {
          if (snapshot.exists) {
            const players = await snapshot.get('players')
            const gameStarted = await snapshot.get('gameStarted')
            const gameOver = await snapshot.get('gameOver')
            if (
              !players.length ||
              (players.length && gameStarted && gameOver)
            ) {
              //if room exists and no one is in it, or
              //if room exists and the game is over
              db.collection('rooms').doc(roomName).set(roomObj)

              /**
               * Otherwise,
               * if room exists and ppl are in it, we do nothing here as they will
               * be passed along into the existing room w/o any modification needed.
               * if the game is already under way, logic in Room.js will not let them join as participants
               */
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
