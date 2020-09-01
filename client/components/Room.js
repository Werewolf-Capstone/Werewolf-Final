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
  async function handleWerewolfVote(roomObj, roomName) {
    // const roomObj = await db
    //   .collection('room')
    //   .doc(roomName)
    //   .get();

    // let players = roomObj.data().players;
    // ^^^ do we need this code above with 'players' ?

    const totalPlayers = roomObj.werewolves.length

    let votesWerewolves = await db
      .collection('rooms')
      .doc(roomName)
      .get()
    votesWerewolves = votesWerewolves.data().votesWerewolves

    //console.log('what are my villagers', votesWerewolves);

    let votingObject = {}

    for (let player of votesWerewolves) {
      // need to add rooms and users tables to state
      if (Object.keys(votingObject).includes(player)) {
        votingObject[player] += 1
      } else {
        votingObject[player] = 1
      }
    }
    //console.log('voting object is', votingObject);
    for (let player of Object.keys(votingObject)) {
      if (votingObject[player] > Math.floor(totalPlayers / 2)) {
        // db.collection('rooms').doc(this.state.gameId).villagersChoice.update(player) // find real way to do this
        db
          .collection('rooms')
          .doc(roomName)
          .update({werewolvesChoice: player, checkWerewolf: true})
        // also have to update local state

        handleCheckWerewolf(true)
        handleWerewolfChoice(player)
      }
    }
  }
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
}

export default Room
