import React, {useState, useEffect, useRef} from 'react'

import VideoAudio from './VideoAudio'

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
  gameStarted
}) => {
  let i
  let shouldWePlay = true
  console.log('what is checkWW', checkWerewolf)
  console.log('what is checkSeer', checkSeer)
  console.log('what is checkMedic', checkMedic)
  console.log('what is localRole', localRole)

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
        <h3>DURING THE DAY NO OTHER CHECKS , role= {localRole}</h3>
        <h2>{werewolfChoice} was killed during the night </h2>
        <div className="participant">
          <h3>{participant.identity}</h3>

          <button
            onClick={() => handleVillagerVoteButton(participant.identity)}
          >
            Kill
          </button>
        </div>
      </div>
    )
  } else if (!night && localRole === 'seer') {
    //console.log.log("DURING THE DAY AND WE ARE THE SEER")
    i = (
      <div>
        <h3>DURING THE DAY AND WE ARE THE SEER</h3>
        <h2>
          {werewolfChoice} was killed during the night , role= {localRole}
        </h2>
        <h2>{didSeerHit} is a werewolf</h2>
        <div className="participant">
          <h3>{participant.identity}</h3>

          <button
            onClick={() => handleVillagerVoteButton(participant.identity)}
          >
            Kill
          </button>
        </div>
      </div>
    )
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    //console.log.log("DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A WEREWOLF")
    shouldWePlay = true
    i = (
      <div className="participant">
        <h3>
          DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A
          WEREWOLF , role= {localRole}
        </h3>
        <h3>{participant.identity}</h3>

        <button onClick={() => handleWerewolfVoteButton(participant.identity)}>
          Kill
        </button>
      </div>
    )
