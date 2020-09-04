/* eslint-disable max-statements */
import React, {useState, useEffect, useRef} from 'react'
import Video from 'twilio-video'
import Participant from './Participant'
import {db} from './firebase'
import {Button} from '@material-ui/core'

const Room = ({roomName, token, handleLogout}) => {
  const [stateRoom, setStateRoom] = useState(null)
  const [participants, _setParticipants] = useState([])
  const [partIdentities, setPartIdentities] = useState([])
  const [participantsColors, setParticipantsColors] = useState([])

  const participantsRef = useRef(participants)

  const setParticipants = (data) => {
    participantsRef.current = data
    _setParticipants(data)
  }

  // potentially needed game logic state
  const [night, setNight] = useState(true)
  const [localRole, setLocalRole] = useState('')
  const [localColor, setLocalColor] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [checkWerewolf, setCheckWerewolf] = useState(false)
  const [checkSeer, setCheckSeer] = useState(false)
  const [checkMedic, setCheckMedic] = useState(false)
  const [werewolfChoice, setWerewolfChoice] = useState(false)
  const [didSeerHit, setDidSeerHit] = useState(false)
  const [votesVill, setVotesVill] = useState([])
  const [votesWere, setVotesWere] = useState([])
  const [votesWereColors, setVotesWereColors] = useState([])
  const [colors, setColors] = useState([])

  const testingReset = () => {
    const newGame = {
      Night: true,
      checkMajority: false,
      checkMedic: false,
      checkSeer: false,
      checkWerewolf: false,
      dead: [],
      gameStarted: false,
      majorityReached: false,
      medic: '',
      medicChoice: '',
      players: [],
      seer: '',
      seerChoice: '',
      villagers: [],
      votesVillagers: [],
      votesWerewolves: [],
      werewolves: [],
      werewolvesChoice: '',
    }
    db.collection('rooms').doc(roomName).update(newGame)
  }
  const handleStartGame = () => {
    setGameStarted(true)
    db.collection('rooms').doc(roomName).update({gameStarted: true})
  }

  const handleNight = (someValue) => {
    setNight(someValue)
  }
  const handleLocalRole = (someValue) => {
    setLocalRole(someValue)
  }
  const handleCheckMedic = (someValue) => {
    setCheckMedic(someValue)
  }
  const handleGameStarted = (someValue) => {
    setGameStarted(someValue)
  }

  const handleGameOver = () => {
    //if num(werewolves) == num(villagers) or num(werewolves) == 0:
    //  set gameOver(true)
    setGameOver(true)
  }

  const handleCheckWerewolf = (someValue) => {
    setCheckWerewolf(someValue)
  }
  const handleCheckSeer = (someValue) => {
    setCheckSeer(someValue)
  }
  const handleWerewolfChoice = (someValue) => {
    setWerewolfChoice(someValue)
  }
  const handleDidSeerHit = (someValue) => {
    setDidSeerHit(someValue)
  }

  // GAME LOGIC FUNCTIONS

  function handleNightToDay(game, roomName, localUserId) {
    if (game.villagers.length === 0) {
      assignRolesAndStartGame(game, roomName, localUserId)
    }
    handleWerewolfVote(game, roomName) // checks if werewolves have agreed on a vote, and sets in our DB
    if (game.checkWerewolf && game.checkSeer && game.checkMedic) {
      if (game.werewolvesChoice === game.medicChoice) {
        game.werewolvesChoice = ''
        handleWerewolfChoice('')
      } else {
        game.villagers = game.villagers.filter((villager) => {
          return villager !== game.werewolvesChoice
        })
        if (game.werewolvesChoice !== '') {
          game.dead.push(game.werewolvesChoice)
          game.players = game.players.filter(
            (player) => player != game.werewolvesChoice
          )
        }
      }
    } else {
      //outer IF
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
    //updating game state in DB

    db.collection('rooms').doc(roomName).update(game)

    handleNight(false)
  }

  /**
   * Handles the transition from day to night by filtering out the player killed, checking if they were a villager or werewolf, resetting all votes, and updating game status
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document
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
      if (!game.dead.includes(game.villagersChoice)) {
        game.dead.push(game.villagersChoice)
      }
    } else {
      //outer IF
      return
    }
    game.Night = true
    game.wereWolvesChoice = ''
    game.majorityReached = false
    game.votesVillagers = []
    db.collection('rooms').doc(roomName).update(game)

    handleNight(true)
  }

  /**
   * Checks for a majority vote on all players killing one person; once found, updates the villagers' choice which will be used to announce the player has been killed when day turns to night.
   * @param {*} game - game object gotten from the snapshot of the 'rooms' document once the game starts
   */
  async function handleMajority(game, roomName) {
    //end goal to update villageGers

    const totalPlayers = game.villagers.length + game.werewolves.length
    let votingObject = {} //key will be a user, value is how many votes for that user
    let players = await db.collection('rooms').doc(roomName).get()
    let votesVillagers = players.data().votesVillagers

    for (let player of votesVillagers) {
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
        db.collection('rooms').doc(roomName).update({
          villagersChoice: player,
          majorityReached: true,
          dead: newDead,
        })
      }
    }
  }

  /**
   * Handler function which updates a villager's vote based on the user they are choosing to kill
   * @param {*} userPeerId - the user's PeerJS ID (that is, the user a villager is trying to kill)
   */
  async function handleVillagerVoteButton(participantIdentity) {
    let votesVillagers = await db.collection('rooms').doc(roomName).get()

    votesVillagers = votesVillagers.data().votesVillagers
    votesVillagers.push(participantIdentity)

    await db
      .collection('rooms')
      .doc(roomName)
      .update({votesVillagers: votesVillagers})
  }

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
   */
  async function assignRolesAndStartGame(game, roomName, localUserId) {
    let gameState = await db.collection('rooms').doc(roomName).get()
    let players = gameState.data().players
    let playerColors = gameState.data().colors
    let werewolves = []
    let villagers = []

    //shuffle users array
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

    function checkPlayer(player) {
      return player === colorP
    }

    let localIndex = colorPlayer.findIndex((val) => val === localUserId)
    setLocalColor(colors[localIndex])

    await db.collection('rooms').doc(roomName).update({werewolves: werewolves})
    await db.collection('rooms').doc(roomName).update({villagers: villagers})

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

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants([...participantsRef.current, participant])
    }

    const participantDisconnected = (participant) => {
      let newParticipantz = [...participantsRef.current]
      newParticipantz = newParticipantz.filter((p) => p !== participant)

      setParticipants(newParticipantz)

      let playerIdentitys = newParticipantz.map(
        (participant) => participant.identity
      )
      setTimeout(function () {
        alert('Hello')
      }, 0)

      db.collection('rooms').doc(roomName).update({players: playerIdentitys})
    }

    Video.connect(token, {
      name: roomName,
    }).then(async (room) => {
      setStateRoom(room)
      setParticipants([...participantsRef.current, room.localParticipant])

      const gameState = await db.collection('rooms').doc(roomName).get()

      let prevPlayers = gameState.data().players
      prevPlayers.push(room.localParticipant.identity)

      let participantsColors = gameState.data().participantsColors

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
          setPartIdentities(gameState.players)

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
        })
    })

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

  const remoteParticipants = participants.map((participant, idx) => {
    if (idx === 0) return
    let pngMapObj = {
      red: '/villagerIconRed.png',
      orange: '/villagerIconOrange.png',
      pink: '/villagerIconPink.png',
      purple: '/villagerIconPurple.png',
      green: '/villagerIconGreen.png',
      brown: '/villagerIconBrown.png',
      blue: '/villagerIconBlue.png',
      yellow: '/villagerIconYellow.png',
    }

    let correctIdx = partIdentities.indexOf(participant.identity)
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
        votesWere={votesWere}
        votesWereColors={votesWereColors}
        imageSrc={fileName}
      />
    )
  })

  let pngMapObj = {
    red: '/villagerIconRed.png',
    orange: '/villagerIconOrange.png',
    pink: '/villagerIconPink.png',
    purple: '/villagerIconPurple.png',
    green: '/villagerIconGreen.png',
    brown: '/villagerIconBrown.png',
    blue: '/villagerIconBlue.png',
    yellow: '/villagerIconYellow.png',
  }

  let players = partIdentities

  if (!stateRoom) return null
  if (!stateRoom.localParticipant) return null
  let idx = players.indexOf(stateRoom.localParticipant.identity)
  let playerColor = colors[idx]
  let fileName = pngMapObj[playerColor]

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      className="room"
    >
      <h4>Room: {roomName}</h4>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleLogout}
      >
        Log out
      </Button>
      <div
        style={{display: 'flex', justifyContent: 'center'}}
        className="local-participant"
      >
        {stateRoom ? (
          <div
            className="videoContainer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              backgroundColor: 'grey',
              padding: 5,
              margin: 20,
            }}
          >
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
              votesWere={votesWere}
              votesWereColors={votesWereColors}
              roomName={stateRoom}
              imageSrc={fileName}
            />
            {remoteParticipants}
          </div>
        ) : (
          ''
        )}
      </div>
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
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={() => {
          testingReset()
        }}
      >
        {' '}
        Reset game
      </Button>
    </div>
  )
}

export default Room
