/* eslint-disable complexity */
import React, {useState, useCallback} from 'react'
import Lobby from './Lobby'
import Room from './Room'
import {db} from './firebase'

/**
 * @summary Component used to get Twilio token and add players into the correct game / create a new game
 */
const VideoChat = () => {
  /**
   * The default game state of a room object in the Firestore database
   */
  const roomObj = {
    Night: true,
    checkMajority: false,
    checkMedic: false,
    checkSeer: false,
    checkWerewolf: false,
    colors: [
      'red',
      'orange',
      'pink',
      'purple',
      'green',
      'brown',
      'blue',
      'yellow',
    ],
    dead: [],
    gameOver: false,
    gameStarted: false,
    majorityReached: false,
    medic: '',
    medicChoice: '',
    participantVotes: [],
    players: [],
    seer: '',
    seerChoice: '',
    villagers: [],
    villagersChoice: '',
    votesVillagers: [],
    votesVillagersColors: [],
    votesWerewolves: [],
    votesWerewolvesColors: [],
    werewolves: [],
    werewolvesChoice: '',
    winner: '',
  }

  /**
   * Functional state and respective setter functions
   */
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
      }).then((res) => res.json()) //getting Twilio token

      setToken(data.token) //setting state with Twilio token that gets you into the correct room

      /**
       * Logic to either add players to the correct game, or to create a new game if the old one is over
       */
      db.collection('rooms')
        .doc(roomName)
        .get()
        .then(async (room) => {
          if (room.exists) {
            const players = await room.get('players')
            const gameStarted = await room.get('gameStarted')
            const gameOver = await room.get('gameOver')

            if (
              !players.length ||
              (players.length && gameStarted && gameOver)
            ) {
              db.collection('rooms').doc(roomName).update(roomObj)
              /**
               * Reset the pre-existing room if:
               * 1) no one is in it, or
               * 2) the game is over
               */

              /**
               * Otherwise, if the room exists and players are in it, we do nothing here as they will
               * be passed along into the existing room w/o any modification needed.
               * If the game is already under way, logic in Room.js will not let them join as participants
               */
            }
          } else {
            // If room does not exist, create a new one
            db.collection('rooms').doc(roomName).set(roomObj)
          }
        })
    },
    [roomName, username]
  )

  const handleLogout = useCallback(() => {
    setToken(null)
    document.getElementById('background').classList.add('lobby')
    document.getElementById('background').classList.remove('day')
  }, [])

  /**
   * Conditional Render:
   * If a visitor already has a token, render the Room component.
   * Otherwise, send them to the Lobby (i.e. landing page)
   */
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
