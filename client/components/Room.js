/* eslint-disable max-statements */
/* eslint-disable complexity */

import React, {useState, useEffect, useRef} from 'react'
import Video from 'twilio-video'
import Participant from './Participant'
import {db} from './firebase'
import {Button} from '@material-ui/core'
import Day from './Day'
import GameOver from './GameOver'
import MessageHeader from './MessageHeader'

const Room = ({roomName, token, handleLogout}) => {
  /**
   * Functional state and respective setter functions
   */
  const [stateRoom, setStateRoom] = useState(null)
  const [participants, _setParticipants] = useState([])
  const [participantIdentities, setParticipantIdentities] = useState([])
  //const [participantsColors, setParticipantsColors] = useState([])
  const [night, setNight] = useState(true)
  const [localRole, setLocalRole] = useState('')
  const [localColor, setLocalColor] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [checkWerewolf, setCheckWerewolf] = useState(false)
  const [checkSeer, setCheckSeer] = useState(false)
  const [checkMedic, setCheckMedic] = useState(false)
  const [werewolfChoice, setWerewolfChoice] = useState(false)
  const [didSeerHit, setDidSeerHit] = useState(false)
  const [votesVill, setVotesVill] = useState([])
  const [votesVillColors, setVotesVillColors] = useState([])
  const [votesWere, setVotesWere] = useState([])
  const [votesWereColors, setVotesWereColors] = useState([])
  const [colors, setColors] = useState([])
  const [winner, setWinner] = useState('')
  const [dead, setDead] = useState([])

  const participantsRef = useRef(participants)

  const setParticipants = (data) => {
    participantsRef.current = data
    _setParticipants(data)
  }

  const pngMapObj = {
    red: '/villagerIconRed.png',
    orange: '/villagerIconOrange.png',
    pink: '/villagerIconPink.png',
    purple: '/villagerIconPurple.png',
    green: '/villagerIconGreen.png',
    brown: '/villagerIconBrown.png',
    blue: '/villagerIconBlue.png',
    yellow: '/villagerIconYellow.png',
  }

  /**
   * Reset button (for testing purposes only)
   */
  const testingReset = () => {
    const newGame = {
      Night: true,
      checkMajority: false,
      checkMedic: false,
      checkSeer: false,
      checkWerewolf: false,
      dead: [],
      gameOver: false,
      gameStarted: false,
      majorityReached: false,
      medic: '',
      medicChoice: '',
      players: [],
      participantVotes: [],
      seer: '',
      seerChoice: '',
      villagers: [],
      votesVillagers: [],
      votesWerewolves: [],
      votesVillagersColors: [],
      votesWerewolvesColors: [],
      werewolves: [],
      werewolvesChoice: '',
      winner: '',
    }
    db.collection('rooms').doc(roomName).update(newGame)
  }

  /**
   * Handler functions for setting state.
   * These need to be defined because we can't pass the functional setter functions into another component.
   */
  const handleStartGame = () => {
    setGameStarted(true)

    db.collection('rooms').doc(roomName).update({gameStarted: true})
  }
  const handleNight = (val) => {
    setNight(val)
  }
  const handleLocalRole = (val) => {
    setLocalRole(val)
  }
  const handleCheckMedic = (val) => {
    setCheckMedic(val)
  }
  const handleGameStarted = (val) => {
    setGameStarted(val)
  }
  const handleGameOver = (winner) => {
    console.log('about to set gameOver to true')
    setGameOver(true)
    setWinner(winner)
    db.collection('rooms').doc(roomName).update({gameOver: true, winner})
  }
  const handleCheckWerewolf = (val) => {
    setCheckWerewolf(val)
  }
  const handleCheckSeer = (val) => {
    setCheckSeer(val)
  }
  const handleWerewolfChoice = (val) => {
    setWerewolfChoice(val)
  }
  const handleDidSeerHit = (val) => {
    setDidSeerHit(val)
  }

  // GAME LOGIC FUNCTIONS

  /**
   * Handles the transition from night to day by filtering out the player killed (if they weren't saved by the medic), resetting all votes, and updating game status
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document
   * @param {*} roomName - the game room's doc ID
   * @param {*} localUserId - the local user's username
   */
  function handleNightToDay(game, roomName, localUserId) {
    if (game.villagers.length === 0) {
      assignRolesAndStartGame(game, roomName, localUserId)
    }

    handleWerewolfVote(game, roomName) // checks if werewolves have agreed on a vote, and sets in Firestore
    if (game.checkWerewolf && game.checkSeer && game.checkMedic) {
      if (game.werewolvesChoice === game.medicChoice) {
        game.werewolvesChoice = ''
        handleWerewolfChoice('') //nullify the werewolves' kill if the medic saved the same player
      } else {
        game.villagers = game.villagers.filter((villager) => {
          return villager !== game.werewolvesChoice
        })
        game.werewolves = game.werewolves.filter((werewolf) => {
          return werewolf !== game.werewolvesChoice
        })
        if (game.werewolvesChoice !== '') {
          game.dead.push(game.werewolvesChoice)
          let removedIdx = -1
          for (let i = 0; i < game.players.length; i++) {
            if (game.players[i] === game.werewolvesChoice) {
              removedIdx = i
            }
          } // end of this loop we know which index to remove from participants

          game.players.splice(removedIdx, 1)
          game.participantVotes.splice(removedIdx, 1)
          game.colors.splice(removedIdx, 1)
          // game.players = game.players.filter((player,idx ) => {
          //   return player !== game.werewolvesChoice
          // }
        }
      }
    } else {
      return
    }
    game.Night = false
    game.medicChoice = ''
    game.votesWerewolves = ''
    game.checkWerewolf = false
    game.checkMedic = false
    game.checkSeer = false
    game.votesWerewolves = []
    game.villagersChoice = ''

    db.collection('rooms').doc(roomName).update(game)

    handleNight(false)
  }

  /**
   * Handles the transition from day to night by filtering out the player killed, checking if they were a villager or werewolf, resetting all votes, and updating game status
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document
   * @param {*} roomName - the game room's doc ID
   */
  function handleDayToNight(game, roomName) {
    handleMajority(game, roomName)

    if (game.majorityReached) {
      if (game.villagers.includes(game.villagersChoice)) {
        game.villagers = game.villagers.filter((villager) => {
          return villager !== game.villagersChoice
        })
      } else {
        game.werewolves = game.werewolves.filter((werewolf) => {
          return werewolf !== game.villagersChoice
        })
      }
      game.players = game.players.filter((player) => {
        return player !== game.villagersChoice
      })
      if (!game.dead.includes(game.villagersChoice)) {
        game.dead.push(game.villagersChoice)
      }
    } else {
      return
    }
    game.Night = true
    game.wereWolvesChoice = ''
    game.majorityReached = false
    game.votesVillagers = []
    db.collection('rooms').doc(roomName).update(game)

    handleNight(true)
    handleDidSeerHit(false)
  }

  /**
   * Checks for a majority vote on all players killing one person; once found, updates the villagers' choice which will be used to announce the player has been killed when day turns to night.
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document once the game starts
   */
  async function handleMajority(game, roomName) {
    const totalPlayers = game.villagers.length + game.werewolves.length
    let votingObject = {} //key will be a user, value is how many votes for that user
    let players = await db.collection('rooms').doc(roomName).get()
    let votesVillagers = players.data().votesVillagers

    for (let player of votesVillagers) {
      player = Object.keys(player)[0]
      console.log('what is player in handleMajority')
      // need to add rooms and users tables to state
      if (Object.keys(votingObject).includes(player)) {
        votingObject[player] += 1
      } else {
        votingObject[player] = 1
      }
    }

    for (let player of Object.keys(votingObject)) {
      if (votingObject[player] > Math.floor(totalPlayers / 2)) {
        let newDead = players.data().dead
        newDead.push(player)

        let nextPlayers = players.data().players

        let numParticipants = nextPlayers.length
        console.log('what is numP', numParticipants)

        let partVoteArray = [] // this will just be pushed so that our initial participantVotes in db has the right number of players
        for (let i = 0; i < numParticipants; i++) {
          partVoteArray.push('')
        }

        console.log(
          'what is our new partVote array after handling Majority',
          partVoteArray
        )

        db.collection('rooms').doc(roomName).update({
          villagersChoice: player,
          majorityReached: true,
          dead: newDead,
          participantVotes: partVoteArray,
        })
      }
    }
  }

  /**
   * Handler function which updates a villager's vote based on the user they are choosing to kill
   * @param {*} participantIdentity - the participant's username (that is, the player a villager is trying to kill)
   */
  async function handleVillagerVoteButton(
    participantIdentity,
    localIdentity,
    localColor
  ) {
    let gameState = await db.collection('rooms').doc(roomName).get()
    let participantVotes = await gameState.data().participantVotes
    let players = await gameState.data().players
    let votesVillagers = await gameState.data().votesVillagers
    let votesVillagersColors = await gameState.data().votesVillagersColors

    // if we have a person we voted for already, we need to replace them and remove them from votesVillagers
    // before adding a new vote to votesVillgers
    let localIdx = players.indexOf(localIdentity)
    let prevVote = ''
    if (participantVotes[localIdx] !== '') {
      prevVote = participantVotes[localIdx]
      console.log('what is my previous vote', prevVote)
      // let lookupObj = {
      //   prevVote: localIdx
      // }
      let lookupObj = {}
      lookupObj.prevVote = localIdx
      let votesVillagersIdx = -1
      let counter = 0

      for (let element of votesVillagers) {
        let key = Object.keys(element)[0]
        console.log('what is element', element)
        console.log('what is key', key)
        if (key === prevVote && element[key] === localIdx) {
          votesVillagersIdx = counter
        }
        counter += 1
      }
      console.log(
        'what is index in votesVillagers of my prev vote',
        votesVillagersIdx
      )
      votesVillagers.splice(votesVillagersIdx, 1)

      let voteColorIdx = votesVillagersColors.indexOf(localColor)
      votesVillagersColors.splice(voteColorIdx, 1)
    }
    let temp = {}
    temp[participantIdentity] = localIdx
    votesVillagers.push(temp)
    participantVotes[localIdx] = participantIdentity

    votesVillagersColors.push(localColor)
    await db.collection('rooms').doc(roomName).update({
      votesVillagers: votesVillagers,
      votesVillagersColors: votesVillagersColors,
      participantVotes: participantVotes,
    })
  }

  /**
   * Handler function which updates a werewolf's vote based on the user they are choosing to kill
   * @param {*} participantIdentity - the target participant's username (i.e the player a werewolf is trying to kill)
   * @param {*} localColor - the local user's voting color
   */
  async function handleWerewolfVoteButton(participantIdentity, localColor) {
    let gameState = await db.collection('rooms').doc(roomName).get()

    let votesWerewolves = gameState.data().votesWerewolves
    votesWerewolves.push(participantIdentity)

    await db
      .collection('rooms')
      .doc(roomName)
      .update({votesWerewolves: votesWerewolves})

    let votesWerewolvesColors = gameState.data().votesWerewolvesColors
    votesWerewolvesColors.push(localColor)

    await db
      .collection('rooms')
      .doc(roomName)
      .update({votesWerewolvesColors: votesWerewolvesColors})
  }

  /**
   * Handler function which updates a seer's selection based on the user whose role they are seeing
   * @param {*} participantIdentity - the target participant's username (i.e the player the seer is trying to see)
   */
  async function handleSeerCheckButton(participantIdentity) {
    const roomObj = await db.collection('rooms').doc(roomName).get()

    let werewolves = roomObj.data().werewolves

    if (werewolves.includes(participantIdentity)) {
      handleDidSeerHit(participantIdentity)
    }
    handleCheckSeer(true)

    await db
      .collection('rooms')
      .doc(roomName)
      .update({checkSeer: true, seerChoice: participantIdentity})
  }

  /**
   * Handler function which updates a medic's selection based on the user whose role they are saving
   * @param {*} participantIdentity - the target participant's username (i.e the player the medic is trying to save)
   */
  async function handleMedicSaveButton(participantIdentity) {
    handleCheckMedic(true)

    await db
      .collection('rooms')
      .doc(roomName)
      .update({checkMedic: true, medicChoice: participantIdentity})
  }

  /**
   * Checks for a majority vote on werewolves killing one person; once found, updates the werewolves' choice which will be used to announce the player has been killed when night turns to day.
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document
   */
  async function handleWerewolfVote(roomObj, roomName) {
    const totalPlayers = roomObj.werewolves.length

    let votesWerewolves = await db.collection('rooms').doc(roomName).get()
    votesWerewolves = votesWerewolves.data().votesWerewolves

    let votingObject = {}

    for (let player of votesWerewolves) {
      // need to add rooms and users tables to state
      if (Object.keys(votingObject).includes(player)) {
        votingObject[player] += 1
      } else {
        votingObject[player] = 1
      }
    }

    for (let player of Object.keys(votingObject)) {
      if (votingObject[player] > Math.floor(totalPlayers / 2)) {
        db.collection('rooms')
          .doc(roomName)
          .update({werewolvesChoice: player, checkWerewolf: true})
        handleCheckWerewolf(true)
        handleWerewolfChoice(player)
      }
    }
  }

  /**
   * Checks if the seer voted, and (if so) subsequently updates the 'checkSeer' boolean in the 'rooms' database
   */
  async function handleSeer(roomName) {
    const player = await db.collection('rooms').doc(roomName).get()
    const seerChoice = player.data().seerChoice

    if (seerChoice === '') return
    else {
      db.collection('rooms').doc(roomName).update({checkSeer: true})
      handleCheckSeer(true)
    }
  }

  /**
   * Checks if the medic voted, and (if so) subsequently updates the 'checkMedic' boolean in the 'rooms' database
   */
  async function handleMedic(roomName) {
    const player = await db.collection('rooms').doc(roomName).get()

    const medicChoice = player.data().medicChoice

    if (medicChoice === '') return
    else {
      db.collection('rooms').doc(roomName).update({checkMedic: true})
      await handleCheckMedic(true)
    }
  }

  /**
   * Randomly assigns roles to users, updates the roles in firestore, and subsequently updates the 'gameStarted' boolean in the 'rooms' database
   * @param {*} game - game object gotten from the snapshot of the 'rooms' database once the game starts
   * @param {*} roomName - the game room's doc ID
   * @param {*} localUserId - the local user's username
   */
  async function assignRolesAndStartGame(game, roomName, localUserId) {
    let gameState = await db.collection('rooms').doc(roomName).get()
    let players = gameState.data().players
    let playerColors = gameState.data().colors
    let werewolves = []
    let villagers = []

    let numParticipants = players.length
    console.log('what is numP', numParticipants)

    let partVoteArray = [] // this will just be pushed so that our initial participantVotes in db has the right number of players
    for (let i = 0; i < numParticipants; i++) {
      partVoteArray.push('')
    }
    console.log('what is partVote', partVoteArray)

    //shuffle users array in order to assign random roles
    // for (let i = users.length - 1; i > 0; i--) {
    //   let j = Math.floor(Math.random() * (i + 1));
    //   [users[i], users[j]] = [users[j], users[i]];
    // }
    const colors = [
      'red',
      'orange',
      'pink',
      'purple',
      'green',
      'brown',
      'blue',
      'yellow',
    ]
    let colorPlayer = []

    players.forEach((playerName, i) => {
      colorPlayer.push(playerName)
      playerColors.push(colors[i])
      if (i < 2) {
        werewolves.push(playerName)
      } else if (i === 2) {
        db.collection('rooms').doc(roomName).update({seer: playerName})
        villagers.push(playerName)
      } else if (i === 3) {
        db.collection('rooms').doc(roomName).update({medic: playerName})
        villagers.push(playerName)
      } else {
        villagers.push(playerName)
      }
    })

    let localIndex = colorPlayer.findIndex((val) => val === localUserId)
    setLocalColor(colors[localIndex])

    await db.collection('rooms').doc(roomName).update({
      werewolves: werewolves,
      villagers: villagers,
      participantVotes: partVoteArray,
    })
    // await db.collection('rooms').doc(roomName).update({villagers: villagers})

    db.collection('rooms').doc(roomName).update({gameStarted: true})

    //search for localUsersRole
    villagers = gameState.data().villagers
    werewolves = gameState.data().werewolves
    let seer = gameState.data().seer
    let medic = gameState.data().medic

    if (villagers.includes(localUserId)) {
      handleLocalRole('villager')
    }
    if (werewolves.includes(localUserId)) {
      handleLocalRole('werewolf')
    }
    if (seer === localUserId) {
      handleLocalRole('seer')
    }
    if (medic === localUserId) {
      handleLocalRole('medic')
    }
  }

  /**
   *
   * Runs after render is committed to screen.
   */
  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants([...participantsRef.current, participant])
    }

    const participantDisconnected = (participant) => {
      let newParticipantz = [...participantsRef.current]
      newParticipantz = newParticipantz.filter((p) => p !== participant)

      let playerIdentitys = newParticipantz.map(
        (participant) => participant.identity
      )

      db.collection('rooms').doc(roomName).update({players: playerIdentitys})
      setParticipants(newParticipantz)
    }

    Video.connect(token, {
      name: roomName,
    }).then(async (room) => {
      setStateRoom(room)
      setParticipants([...participantsRef.current, room.localParticipant])

      const gameState = await db.collection('rooms').doc(roomName).get()

      let prevPlayers = gameState.data().players
      prevPlayers.push(room.localParticipant.identity)

      //let participantsColors = gameState.data().participantsColors

      db.collection('rooms').doc(roomName).update({players: prevPlayers})

      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)

      db.collection('rooms')
        .doc(roomName)
        .onSnapshot(async (snapshot) => {
          let gameState = snapshot.data()

          setGameStarted(gameState.gameStarted)
          setCheckSeer(gameState.checkSeer)
          setCheckMedic(gameState.checkMedic)
          setCheckWerewolf(gameState.checkWerewolf)
          setVotesVill(gameState.votesVillagers)
          setVotesWere(gameState.votesWerewolves)
          setVotesWereColors(gameState.votesWerewolvesColors)
          setVotesVillColors(gameState.votesVillagersColors)
          setParticipantIdentities(gameState.players)
          setDead(gameState.dead)

          let colors = gameState.colors

          setColors(colors)

          let newParticipants = gameState.players.filter(
            (player) => !gameState.dead.includes(player)
          )

          let temp = [...participantsRef.current]
          newParticipants = temp.filter((p) =>
            newParticipants.includes(p.identity)
          )

          setParticipants(newParticipants)

          if (!gameState.gameStarted) return

          if (gameState.Night) {
            handleNightToDay(
              gameState,
              roomName,
              room.localParticipant.identity
            )
          } else {
            handleDayToNight(gameState, roomName)
          }

          /**
           * Check if game is over.
           */
          if (
            gameState.werewolves.length === 0 &&
            gameState.villagers.length === 0
          ) {
            // If both arrays are empty, keep going.
            // This check was put in place to avoid calling Game Over before roles are assigned.
          } else if (
            gameState.villagers.length === gameState.werewolves.length
          ) {
            handleGameOver('werewolves')
          } else if (gameState.werewolves.length === 0) {
            handleGameOver('villagers')
          }
        })
    })

    /**
     * Disconnects a player from the room if they refresh or close the tab.
     */
    return () => {
      setStateRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop()
          })
          currentRoom.disconnect()

          return null
        } else {
          return currentRoom
        }
      })
    }
  }, [roomName, token])

  /**
   * Rendering all remote participants
   */
  const remoteParticipants = participants.map((participant, idx) => {
    if (idx === 0) return

    let correctIdx = participantIdentities.indexOf(participant.identity)
    let playerColor = colors[correctIdx]
    let fileName = pngMapObj[playerColor]

    return (
      <Participant
        key={participant.sid}
        participant={participant}
        handleVillagerVoteButton={handleVillagerVoteButton}
        handleSeerCheckButton={handleSeerCheckButton}
        handleMedicSaveButton={handleMedicSaveButton}
        handleWerewolfVoteButton={handleWerewolfVoteButton}
        night={night}
        localRole={localRole}
        checkWerewolf={checkWerewolf}
        checkSeer={checkSeer}
        checkMedic={checkMedic}
        werewolfChoice={werewolfChoice}
        didSeerHit={didSeerHit}
        gameStarted={gameStarted}
        localColor={localColor}
        votesVill={votesVill}
        votesVillColors={votesVillColors}
        votesWere={votesWere}
        votesWereColors={votesWereColors}
        imageSrc={fileName}
        localIdentity={stateRoom.localParticipant.identity}
        isLocal={false}
      />
    )
  })

  /**
   * Render local participant
   */
  let players = participantIdentities

  if (!stateRoom) return null
  if (!stateRoom.localParticipant) return null
  let idx = players.indexOf(stateRoom.localParticipant.identity)
  let playerColor = colors[idx]
  let fileName = pngMapObj[playerColor]

  console.log('what is our dead array', dead)

  return (
    <div>
      <MessageHeader
        werewolfChoice={werewolfChoice}
        night={night}
        gameStarted={gameStarted}
        localRole={localRole}
        didSeerHit={didSeerHit}
        checkWerewolf={checkWerewolf}
        checkSeer={checkSeer}
        checkMedic={checkMedic}
        gameOver={gameOver}
      />

      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        className="room"
      >
        {gameOver ? <GameOver winner={winner} /> : <Day />}
        <div
          style={{display: 'flex', justifyContent: 'center'}}
          className="local-participant"
        >
          {stateRoom ? (
            <div className="videoContainer">
              {!dead.includes(stateRoom.localParticipant.identity) ? (
                <Participant
                  key={stateRoom.localParticipant.sid}
                  participant={stateRoom.localParticipant}
                  handleVillagerVoteButton={handleVillagerVoteButton}
                  handleSeerCheckButton={handleSeerCheckButton}
                  handleMedicSaveButton={handleMedicSaveButton}
                  handleWerewolfVoteButton={handleWerewolfVoteButton}
                  night={night}
                  localRole={localRole}
                  localColor={localColor}
                  checkWerewolf={checkWerewolf}
                  checkSeer={checkSeer}
                  checkMedic={checkMedic}
                  werewolfChoice={werewolfChoice}
                  didSeerHit={didSeerHit}
                  gameStarted={gameStarted}
                  votesVill={votesVill}
                  votesVillColors={votesVillColors}
                  votesWere={votesWere}
                  votesWereColors={votesWereColors}
                  roomName={stateRoom}
                  imageSrc={fileName}
                  isLocal={true}
                />
              ) : null}

              {remoteParticipants}
            </div>
          ) : (
            ''
          )}
        </div>

        {!gameStarted ? (
          <div>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => {
                handleStartGame()
              }}
            >
              Start Game
            </Button>
          </div>
        ) : (
          ''
        )}

        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => {
            testingReset()
          }}
        >
          {/* {' '} */}
          Reset game
        </Button>
      </div>
    </div>
  )
}

export default Room
