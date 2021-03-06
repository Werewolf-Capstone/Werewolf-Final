/* eslint-disable react/button-has-type */
/* eslint-disable complexity */
import React from 'react'
import VideoAudio from './VideoAudio'
import {Button} from '@material-ui/core'

/**
 * A participant component to display the individual player's video, username, and voting icon,
 * all of which are loaded conditionally depending on the status of the game
 * (e.g. night vs. day time, whether or not it is their turn to vote, etc.)
 * @param {*} param0
 */
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
  gameStarted,
  localColor,
  votesVill,
  votesVillColors,
  votesWere,
  votesWereColors,
  imageSrc,
  localIdentity,
  isLocal,
  gameOver,
  remoteRole,
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
  if (gameOver) {
    info = null
    lower = (
      <div className="lowerInfoBox">
        <div className="roleReveal">{remoteRole ? remoteRole : localRole}</div>
      </div>
    )
  } else if (!night) {
    info = (
      <div id={participant.identity}>
        {votesVill.map((playerObj, idx) => {
          if (Object.keys(playerObj)[0] === participant.identity) {
            return (
              <img
                className="playerVotingIcon"
                src={pngMapObj[votesVillColors[idx]]}
              ></img>
            )
          }
        })}
      </div>
    )
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity"> {participant.identity} </div>
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
      </div>
    )
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    shouldWePlay = true
    info = (
      <div>
        <div id={participant.identity}>
          {votesWere.map((playerId, idx) => {
            if (playerId === participant.identity) {
              return (
                <img
                  className="playerVotingIcon"
                  src={pngMapObj[votesWereColors[idx]]}
                ></img>
              )
            }
          })}
        </div>
      </div>
    )
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity"> {participant.identity} </div>
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
      </div>
    )
  } else if (night && checkWerewolf && !checkSeer && localRole === 'seer') {
    shouldWePlay = true
    info = null
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity"> {participant.identity} </div>
        <Button
          size="small"
          variant="contained"
          color="default"
          onClick={() => handleSeerCheckButton(participant.identity)}
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
    shouldWePlay = true
    info = null
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity"> {participant.identity} </div>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleMedicSaveButton(participant.identity)}
        >
          Save Person
        </Button>
      </div>
    )
  } else if (!gameStarted) {
    shouldWePlay = true
    info = null
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity">{participant.identity}</div>
      </div>
    )
  } else {
    shouldWePlay = false
    info = null
    lower = (
      <div className="lowerInfoBox">
        <div className="participantIdentity">{participant.identity}</div>
      </div>
    )
  }
  if (shouldWePlay) {
    if (gameOver) {
      return (
        <div className="individualPlayer">
          <div className="infoBox">{info}</div>
          <div>
            <VideoAudio
              participant={participant}
              localColor={localColor}
              isLocal={isLocal}
            />
          </div>
          <div className="lowerInfoBox">{lower}</div>
        </div>
      )
    } else {
      return (
        <div className="individualPlayer">
          <div className="infoBox">{info}</div>
          <div>
            <div>
              <img className="playerIcon" src={imageSrc}></img>
            </div>
            <VideoAudio
              participant={participant}
              localColor={localColor}
              isLocal={isLocal}
            />
          </div>
          <div className="lowerInfoBox">{lower}</div>
        </div>
      )
    }
  } else {
    return (
      <div className="individualPlayer">
        <div className="infoBox">{info}</div>
        <div>
          <div>
            <img className="playerIcon" src={imageSrc}></img>
          </div>
          <img
            style={{
              width: '200px',
              borderStyle: 'solid',
              borderRadius: '25%',
            }}
            src="/sleeping.png"
          ></img>
        </div>
        <div className="lowerInfoBox">{lower}</div>
      </div>
    )
  }
}

export default Participant
