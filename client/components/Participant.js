/* eslint-disable react/button-has-type */
/* eslint-disable complexity */
import React from 'react'
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
  localColor,
  votesVill,
  votesVillColors,
  votesWere,
  votesWereColors,
  imageSrc,
  localIdentity,
  isLocal,
}) => {
  let info
  let lower
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

  if (!participant) return

  console.log('what is isLocal in participant', isLocal)

  if (!night) {
    info = (
      <div>
        {/* <div>DURING THE DAY NO OTHER CHECKS , role= {localRole}</div> */}
        <div style={{color: 'red', fontWeight: 'bold'}}>
          {werewolfChoice} was killed during the night{' '}
        </div>
        <div className="participant">
          <div>{participant.identity}</div>
        </div>
      </div>
    )
    lower = (
      <div>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() =>
            handleVillagerVoteButton(
              participant.identity,
              localIdentity,
              localColor
            )
          }
        >
          Kill
        </Button>
      </div>
    )
  } else if (!night && localRole === 'seer') {
    info = (
      <div>
        {/* <div>DURING THE DAY AND WE ARE THE SEER</div> */}
        <div style={{color: 'red', fontWeight: 'bold'}}>
          {werewolfChoice} was killed during the night , role= {localRole}
        </div>
        <div style={{color: 'red', fontWeight: 'bold'}}>
          {didSeerHit} is a werewolf
        </div>
        <div className="participant">
          <div>{participant.identity}</div>
        </div>
      </div>
    )
    lower = (
      <div>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleVillagerVoteButton(participant.identity)}
        >
          Kill
        </Button>
      </div>
    )
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    shouldWePlay = true
    info = (
      <div className="participant">
        {/* <div>
          DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A
          WEREWOLF , role= {localRole}
        </div> */}
        <div>{participant.identity}</div>
        <div id={participant.identity}>
          {votesWere.map((playerId, idx) => {
            if (playerId === participant.identity) {
              return (
                <img
                  style={{width: '40px', height: '40px'}}
                  src={pngMapObj[votesWereColors[idx]]}
                ></img>
              )
            }
          })}
        </div>
      </div>
    )
    lower = (
      <div>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() =>
            handleWerewolfVoteButton(participant.identity, localColor)
          }
        >
          Kill
        </Button>
      </div>
    )
  } else if (night && checkWerewolf && !checkSeer && localRole === 'seer') {
    shouldWePlay = true
    info = (
      <div className="participant">
        {/* <div>
          DURING THE NIGHT AND WEREWOLVES ARE DONE, SEER IS NOT DONE, AND WE ARE
          THE SEER , role= {localRole}
        </div> */}
        <div>{participant.identity}</div>
      </div>
    )
    lower = (
      <Button
        size="small"
        variant="contained"
        color="default"
        onClick={(e) => handleSeerCheckButton(participant.identity)}
      >
        Check Role
      </Button>
    )
  } else if (
    night &&
    checkWerewolf &&
    checkSeer &&
    !checkMedic &&
    localRole === 'medic'
  ) {
    shouldWePlay = true
    info = (
      <div className="participant">
        {/* <div>
          DURING THE NIGHT AND WEREWOLVES ARE DONE AND SEER IS DONE AND MEDIC IS
          NOT DONE AND WE ARE THE MEDIC , role= {localRole}
        </div> */}
        <div>{participant.identity}</div>
      </div>
    )
    lower = (
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={(e) => handleMedicSaveButton(participant.identity)}
      >
        Save Person
      </Button>
    )
  } else if (!gameStarted) {
    shouldWePlay = true
    info = (
      <div className="participant">
        {/* <div>GAME NOT STARTED, role= {localRole}</div> */}
        <div>{participant.identity}</div>
      </div>
    )
  } else {
    shouldWePlay = false
    info = (
      <div className="participant">
        <div style={{color: 'red', fontWeight: 'bold'}}>
          Sleep well, {participant.identity}. Hopefully you survive the night.
        </div>
        <div>{participant.identity}</div>
      </div>
    )
  }
  if (shouldWePlay) {
    return (
      <div
        className="individualPlayer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '15rem',
          margin: '5px',
        }}
      >
        <div>
          {info}
          {localRole === 'seer' ? <h3>{didSeerHit} test seer</h3> : null}
        </div>
        {/* <video ref={videoRef} autoPlay={shouldWePlay} muted={true} />
        <audio ref={audioRef} autoPlay={shouldWePlay} muted={true} /> */}
        <div id={participant.identity}>
          {votesVill.map((playerId, idx) => {
            if (playerId === participant.identity) {
              return (
                <img
                  style={{width: '40px', height: '40px'}}
                  src={pngMapObj[votesVillColors[idx]]}
                ></img>
              )
            }
          })}

          {/* {votesWere.map((playerId, idx) => {
            if (playerId === participant.identity) {
              return (
                <img
                  style={{width: '40px', height: '40px'}}
                  src={pngMapObj[votesWereColors[idx]]}
                ></img>
              )
            }
          })} */}
        </div>
        <div>
          <div className="playerIcon">
            <img
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '25%',
                borderStyle: 'solid',
                position: 'absolute',
              }}
              src={imageSrc}
            ></img>
          </div>
          <VideoAudio
            participant={participant}
            localColor={localColor}
            isLocal={isLocal}
          />
        </div>

        {lower}
      </div>
    )
  } else {
    return (
      <div
        className="individualPlayer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '15rem',
          margin: '5px',
        }}
      >
        <div> {info} </div>
        {/* <video ref={videoRef} autoPlay={shouldWePlay} muted={true} />
        <audio ref={audioRef} autoPlay={shouldWePlay} muted={true} /> */}
        <div>
          <div className="playerIcon">
            <img
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '25%',
                borderStyle: 'solid',
                position: 'absolute',
              }}
              src={imageSrc}
            ></img>
          </div>
          <img
            style={{
              height: '10rem',
              borderStyle: 'solid',
              borderRadius: '25%',
            }}
            src="/sleeping.png"
          ></img>
        </div>
      </div>
    )
  }
}

export default Participant
