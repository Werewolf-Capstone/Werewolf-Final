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

  function handleDayToNight(game, roomName) {
    handleMajority(game, roomName)
    if (game.majorityReached) {
      if (game.villagers.includes(game.villagersChoice)) {
        game.villagers = game.villagers.filter(villager => {
          return villager !== game.villagersChoice
        })
      } else {
        game.werewolves = game.werewolves.filter(werewolf => {
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
    // game.villagersChoice = ""
    game.wereWolvesChoice = ''
    game.majorityReached = false
    game.votesVillagers = []
    //updating game state in DB

    //console.log('DURING DAY, ABOUT TO GO TO NIGHT', game);

    db
      .collection('rooms')
      .doc(roomName)
      .update(game)

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
    // let players = await db.collection('rooms').doc(this.state.gameId).data().players

    let players = await db
      .collection('rooms')
      .doc(roomName)
      .get()
    let votesVillagers = players.data().votesVillagers

    for (let player of votesVillagers) {
      // need to add rooms and users tables to state
      if (Object.keys(votingObject).includes(player)) {
        votingObject[player] += 1
      } else {
        votingObject[player] = 1
      }
    }
    //console.log('in handle majority', votingObject);

    for (let player of Object.keys(votingObject)) {
      if (votingObject[player] > Math.floor(totalPlayers / 2)) {
        let newDead = players.data().dead
        newDead.push(player)
        db
          .collection('rooms')
          .doc(roomName)
          .update({
            villagersChoice: player,
            majorityReached: true,
            dead: newDead
          })
      }
    }
  }

  /**
   * Randomly assigns roles to users, updates the roles in firestore, and subsequently updates the 'gameStarted' boolean in the 'rooms' database
   * @param {*} game - game object gotten from the snapshot of the 'rooms' database once the game starts
   */
  async function assignRolesAndStartGame(game, roomName, localUserId) {
    console.log('In assignRolesAndStartGame', game, roomName, localUserId)
    let gameState = await db
      .collection('rooms')
      .doc(roomName)
      .get()

    console.log('what is gameState in assignRoles', gameState)

    let players = gameState.data().players

    //randomize later
    //console.log('what is users in assign roles', users);

    let werewolves = []
    let villagers = []

    // shuffle users array
    // for (let i = users.length - 1; i > 0; i--) {
    //   let j = Math.floor(Math.random() * (i + 1));
    //   [users[i], users[j]] = [users[j], users[i]];
    // }

    players.forEach((playerName, i) => {
      //console.log('what does my user look like', doc.id);

      if (i < 2) {
        //console.log('werewolves are ', werewolves);
        werewolves.push(playerName)
      } else if (i === 2) {
        db
          .collection('rooms')
          .doc(roomName)
          .update({seer: playerName})
        villagers.push(playerName)
      } else if (i === 3) {
        db
          .collection('rooms')
          .doc(roomName)
          .update({medic: playerName})
        villagers.push(playerName)
      } else {
        villagers.push(playerName)
      }
    })
  }
  await db
      .collection('rooms')
      .doc(roomName)
      .update({werewolves: werewolves})
    await db
      .collection('rooms')
      .doc(roomName)
      .update({villagers: villagers})

    db
      .collection('rooms')
      .doc(roomName)
      .update({gameStarted: true})

    //search for localUsersRole
    villagers = gameState.data().villagers
    werewolves = gameState.data().werewolves
    let seer = gameState.data().seer
    let medic = gameState.data().medic

    if (villagers.includes(localUserId)) {
      console.log('setting role as villager')
      handleLocalRole('villager')
    }
    if (werewolves.includes(localUserId)) {
      console.log('setting role as werewolf')
      handleLocalRole('werewolf')
    }
    if (seer === localUserId) {
      console.log('setting role as seer')
      handleLocalRole('seer')
    }
    if (medic === localUserId) {
      console.log('setting role as medic')
      handleLocalRole('medic')
    }
}

export default Room
