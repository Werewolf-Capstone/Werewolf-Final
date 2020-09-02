/* eslint-disable react/button-has-type */
/* eslint-disable complexity */
import React, {useState, useEffect, useRef} from 'react'
import VideoAudio from './VideoAudio'
import {Button} from '@material-ui/core'

const Participant = ({
  participant,
  handleVillagerVoteButton,
  handleSeerCheckButton,
  handleMedicSaveButton,
  handleWerewolfVoteButton,
  night,
  checkWerewolf,
  checkSeer,
  checkMedic,
  localRole,
  werewolfChoice,
  didSeerHit,
  gameStarted,
  votesVill,
  localColor,
  votesWere,
}) => {
  let i
  let shouldWePlay = true
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
  console.log('what is checkWW', checkWerewolf)
  console.log('what is checkSeer', checkSeer)
  console.log('what is checkMedic', checkMedic)
  console.log('what is localRole', localRole)
  console.log('what is votesVill', votesVill)

  // return (
  //   <div className="participant">
  //     <h3>{participant.identity}</h3>
  //     <video ref={videoRef} autoPlay={true} />
  //     <audio ref={audioRef} autoPlay={true} muted={true} />
  //   </div>
  // );
  if (!participant) return
  //console.log.log("what is participant11111111", participant)
  if (!night) {
    //console.log.log("DURING THE DAY NO OTHER CHECKS")
    i = (
      <div>
        <div>DURING THE DAY NO OTHER CHECKS , role= {localRole}</div>
        <div>{werewolfChoice} was killed during the night </div>
        <div className="participant">
          <div>{participant.identity}</div>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => handleVillagerVoteButton(participant.identity)}
          >
            Kill
          </Button>
        </div>
      </div>
    )
  } else if (!night && localRole === 'seer') {
    //console.log.log("DURING THE DAY AND WE ARE THE SEER")
    i = (
      <div>
        <div>DURING THE DAY AND WE ARE THE SEER</div>
        <div>
          {werewolfChoice} was killed during the night , role= {localRole}
        </div>
        <div>{didSeerHit} is a werewolf</div>
        <div className="participant">
          <div>{participant.identity}</div>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => handleVillagerVoteButton(participant.identity)}
          >
            Kill
          </Button>
        </div>
      </div>
    )
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    //console.log.log("DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A WEREWOLF")
    shouldWePlay = true
    i = (
      <div className="participant">
        <div>
          DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A
          WEREWOLF , role= {localRole}
        </div>
        <div>{participant.identity}</div>

        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleWerewolfVoteButton(participant.identity)}
        >
          Kill
        </Button>
        <div id={participant.identity}>
          {votesWere.map((playerId) => {
            if (playerId === participant.identity) {
              return (
                <img
                  style={{width: '40px', height: '40px'}}
                  src={pngMapObj[localColor]}
                ></img>
              )
            }
          })}
        </div>
      </div>
    )
  } else if (night && checkWerewolf && !checkSeer && localRole === 'seer') {
    //console.log.log("DURIONG THE NIGHT AND WEREWOLVES ARE DONE, SEER IS NOT DONE, AND WE ARE THE SEER")
    shouldWePlay = true
    i = (
      <div className="participant">
        <div>
          DURIONG THE NIGHT AND WEREWOLVES ARE DONE, SEER IS NOT DONE, AND WE
          ARE THE SEER , role= {localRole}
        </div>
        <div>{participant.identity}</div>

        <Button
          size="small"
          variant="contained"
          color="default"
          onClick={(e) => handleSeerCheckButton(participant.identity)}
        >
          Check Role
        </Button>
      </div>
    )
  } else if (
    night &&
    checkWerewolf &&
    checkSeer &&
    !checkMedic &&
    localRole === 'medic'
  ) {
    //console.log.log("DURING THE NIGHT AND WEREWOLVES ARE DONE AND SEE IS DONE AND MEDIC IS NOT DONE AND WE ARE THE MEDIC")
    shouldWePlay = true
    i = (
      <div className="participant">
        <div>
          DURING THE NIGHT AND WEREWOLVES ARE DONE AND SEER IS DONE AND MEDIC IS
          NOT DONE AND WE ARE THE MEDIC , role= {localRole}
        </div>
        <div>{participant.identity}</div>

        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={(e) => handleMedicSaveButton(participant.identity)}
        >
          Save Person
        </Button>
      </div>
    )
  } else if (!gameStarted) {
    console.log('SEER IS STILL NOT SEEING GAME STARTED')
    shouldWePlay = true
    i = (
      <div className="participant">
        <div>GAME NOT STARTED, role= {localRole}</div>
        <div>{participant.identity}</div>
        <div>You are not allowed to see this person during the night</div>
      </div>
    )
  } else {
    //console.log.log("DURING THE NIGHT BUT WE ARE A VANILLA VILLAGER")

    shouldWePlay = false
    i = (
      <div className="participant">
        <div>
          222DURING THE NIGHT BUT WE ARE A VANILLA VILLAGER, OR DONE WITH OUR
          TASK, role= {localRole}
        </div>
        <div>{participant.identity}</div>
        <div>You are not allowed to see this person during the night</div>
      </div>
    )
  }
  if (shouldWePlay) {
    return (
      <div className="individualPlayer" style={{width: '15rem'}}>
        {i}
        {/* <video ref={videoRef} autoPlay={shouldWePlay} muted={true} />
        <audio ref={audioRef} autoPlay={shouldWePlay} muted={true} /> */}
        <div className="playerIcon">
          <img
            style={{width: '40px', height: '40px', position: 'absolute'}}
            src={pngMapObj[localColor]}
          ></img>
        </div>
        <VideoAudio participant={participant} localColor={localColor} />
        <div id={participant.identity}>
          {votesVill.map((playerId) => {
            if (playerId === participant.identity) {
              return (
                <img
                  style={{width: '40px', height: '40px'}}
                  src={pngMapObj[localColor]}
                ></img>
              )
            }
          })}
        </div>
      </div>
    )
  } else {
    return (
      <div className="individualPlayer" style={{width: '15rem'}}>
        {i}
        {/* <video ref={videoRef} autoPlay={shouldWePlay} muted={true} />
        <audio ref={audioRef} autoPlay={shouldWePlay} muted={true} /> */}
        <div>You are not allowed to see video at this time</div>
        <img
          style={{
            height: '10rem',
            borderStyle: 'solid',
            borderRadius: '25%',
          }}
          src="/sleeping.png"
        ></img>
      </div>
    )
  }
}

export default Participant
