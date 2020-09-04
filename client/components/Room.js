/* eslint-disable max-statements */
import React, {useState, useEffect, useRef} from 'react'
import Video from 'twilio-video'
import Participant from './Participant'
import {db} from './firebase'
import {Button} from '@material-ui/core'
import Rules from './Rules.js'
import Day from './Day.js'
import MajorityReached from './MajorityReached'
import VillagersWin from './VillagersWin'
import WerewolvesWin from './WerewolvesWin'

const Room = ({roomName, token, handleLogout}) => {
  /**
   * Functional state and respective setter functions
   */
  const [stateRoom, setStateRoom] = useState(null)
  const [participants, _setParticipants] = useState([])
  const [participantIdentities, setParticipantIdentities] = useState([])
  const [participantsColors, setParticipantsColors] = useState([])
  const [night, setNight] = useState(true)
  const [localRole, setLocalRole] = useState('')
  const [localColor, setLocalColor] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [checkWerewolf, setCheckWerewolf] = useState(false)
  const [checkSeer, setCheckSeer] = useState(false)
  const [checkMedic, setCheckMedic] = useState(false)
  const [werewolfChoice, setWerewolfChoice] = useState(false)
  const [didSeerHit, setDidSeerHit] = useState(false)
  const [votesVill, setVotesVill] = useState([])
  const [votesWere, setVotesWere] = useState([])
  const [votesWereColors, setVotesWereColors] = useState([])

  const participantsRef = useRef(participants)

  const setParticipants = (data) => {
    participantsRef.current = data
    _setParticipants(data)
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
      gameStarted: false,
      majorityReached: false,
      medic: '',
      medicChoice: '',
      players: [],
      participantVotes: ['', '', '', '', '', '', '', ''],
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

  /**
   * Handler functions for setting state.
   * These need to be defined because we can't pass the functional setter functions into another component.
   */
  const handleStartGame = () => {
    setGameStarted(true)
    ////console.log("starting game")
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
  const handleGameOver = () => {
    //if num(werewolves) == num(villagers) or num(werewolves) == 0: set gameOver(true)
    setGameOver(true)
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
    ////console.log("handleNightToDay starting", game, roomName, localUserId)
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
        if (game.werewolvesChoice !== '') {
          game.dead.push(game.werewolvesChoice)
          game.players = game.players.filter(
            (player) => player !== game.werewolvesChoice
          )
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
    ////console.log('in handle majority', votingObject);

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
   * @param {*} participantIdentity - the participant's username (that is, the player a villager is trying to kill)
   */
  async function handleVillagerVoteButton(participantIdentity, localIdentity) {
    console.log('inside handle vill vote localIdent', localIdentity)
    let gameState = await db.collection('rooms').doc(roomName).get()
    let participantVotes = await gameState.data().participantVotes
    let votesVillagers = await gameState.data().votesVillagers

    // if we have a person we voted for already, we need to replace them and remove them from votesVillagers
    // before adding a new vote to votesVillgers
    let localIdx = participantVotes.indexOf(localIdentity)
    let prevVote = ''
    console.log('what is localIdx', localIdx)
    if (participantVotes[localIdx] !== '') {
      prevVote = participantVotes[localIdx]
      let votesVillagersIdx = votesVillagers.indexOf(prevVote)
      votesVillagers.splice(votesVillagersIdx, 1)
      participantVotes[localIdx] = participantIdentity
    }

    votesVillagers.push(participantIdentity)
    await db
      .collection('rooms')
      .doc(roomName)
      .update({votesVillagers: votesVillagers})
  }

  /**
   * Handler function which updates a werewolf's vote based on the user they are choosing to kill
   * @param {*} participantIdentity - the target participant's username (i.e the player a werewolf is trying to kill)
   * @param {*} localColor - the local user's voting color
   */
  async function handleWerewolfVoteButton(participantIdentity, localColor) {
    let gameState = await db.collection('rooms').doc(roomName).get()

    //console.log('Are we getting the correct', participantIdentity)

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

    ////console.log('what are my villagers', votesWerewolves);

    let votingObject = {}

    for (let player of votesWerewolves) {
      // need to add rooms and users tables to state
      if (Object.keys(votingObject).includes(player)) {
        votingObject[player] += 1
      } else {
        votingObject[player] = 1
      }
    }
    ////console.log('voting object is', votingObject);
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
      ////console.log('setting checkSeer to true');
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
      ////console.log('setting checkMedic to true');
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
    //console.log('In assignRolesAndStartGame', game, roomName, localUserId)
    let gameState = await db.collection('rooms').doc(roomName).get()

    //console.log('what is gameState in assignRoles', gameState)

    let players = gameState.data().players

    //randomize later
    ////console.log('what is users in assign roles', users);

    let werewolves = []
    let villagers = []

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
      ////console.log('what does my user look like', doc.id);

      colorPlayer.push(playerName)
      if (i < 2) {
        ////console.log('werewolves are ', werewolves);
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

    /**
     *
     * @param {*} player
     */
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
      //console.log('setting role as villager')
      handleLocalRole('villager')
    }
    if (werewolves.includes(localUserId)) {
      //console.log('setting role as werewolf')
      handleLocalRole('werewolf')
    }
    if (seer === localUserId) {
      //console.log('setting role as seer')
      handleLocalRole('seer')
    }
    if (medic === localUserId) {
      //console.log('setting role as medic')
      handleLocalRole('medic')
    }
  }

  /**
   *
   * Runs after render is committed to screen.
   */
  useEffect(() => {
    const participantConnected = (participant) => {
      // setParticipants((prevParticipants) => [...prevParticipants, participant])
      setParticipants([...participantsRef.current, participant])

      console.log('particiapnts', participantsRef.current)
    }

    const participantDisconnected = (participant) => {
      console.log('WHAT IS PARTICIPANTS REF', participantsRef.current)
      let newParticipantz = [...participantsRef.current]
      console.log('PRE NP', newParticipantz)
      newParticipantz = newParticipantz.filter((p) => p !== participant)
      console.log('POST NP', newParticipantz)

      setParticipants(newParticipantz)

      console.log('player identity BEFOR ', participantsRef.current)

      let playerIdentitys = newParticipantz.map(
        (participant) => participant.identity
      )
      setTimeout(function () {
        alert('Hello')
      }, 0)

      console.log('player identity AFTER ', playerIdentitys)

      db.collection('rooms').doc(roomName).update({players: playerIdentitys})
    }

    Video.connect(token, {
      name: roomName,
    }).then(async (room) => {
      setStateRoom(room)
      // setParticipants((prevParticipants) => [
      //   ...prevParticipants,
      //   room.localParticipant,
      // ])
      setParticipants([...participantsRef.current, room.localParticipant])

      const gameState = await db.collection('rooms').doc(roomName).get()

      let prevPlayers = gameState.data().players
      prevPlayers.push(room.localParticipant.identity)
      db.collection('rooms').doc(roomName).update({players: prevPlayers})

      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)

      db.collection('rooms')
        .doc(roomName)
        .onSnapshot(async (snapshot) => {
          ////console.log("made it into onSnapshot")
          let gameState = snapshot.data()

          //console.log('what is our gameStarted111', gameState)

          setGameStarted(gameState.gameStarted)

          setCheckSeer(gameState.checkSeer)
          setCheckMedic(gameState.checkMedic)
          setCheckWerewolf(gameState.checkWerewolf)
          setVotesVill(gameState.votesVillagers)
          setVotesWere(gameState.votesWerewolves)
          setVotesWereColors(gameState.votesWerewolvesColors)
          setParticipantIdentities(gameState.players)

          let colors = gameState.colors

          setColors(colors)

          let newParticipants = gameState.players.filter(
            (player) => !gameState.dead.includes(player)
          )
          //console.log('FILTERED FOR DEAD PPL', newParticipants)

          // setParticipants((prevParticipants) =>
          //   prevParticipants.filter((p) => newParticipants.includes(p.identity))
          // )
          let temp = [...participantsRef.current]
          newParticipants = temp.filter((p) =>
            newParticipants.includes(p.identity)
          )

          setParticipants(newParticipants)

          ////console.log("gameState is", gameState)

          if (!gameState.gameStarted) return

          if (gameState.Night) {
            ////console.log("pre initial handleNightDay")

            handleNightToDay(
              gameState,
              roomName,
              room.localParticipant.identity
            )
          } else {
            ////console.log("are we making it into here")
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

  /**
   * Rendering all remote participants
   */
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
        votesWere={votesWere}
        votesWereColors={votesWereColors}
        imageSrc={fileName}
        localIdentity={stateRoom.localParticipant.identity}
        isLocal={false}
      />
    )
  })

  //colored voting icons
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

  /**
   * Render local participant
   */
  let players = participantIdentities

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
      {/* <h4>Room: {roomName}</h4> */}
      <Day />
      {/* <MajorityReached /> */}
      {/* <VillagersWin /> */}
      {/* <WerewolvesWin /> */}
      <Rules />
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
              // width: '90%',
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
              isLocal={true}
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
