import React from 'react'
import Rules from './Rules'

const MessageHeader = ({
  werewolfChoice,
  night,
  gameStarted,
  localRole,
  didSeerHit,
  checkMedic,
  checkSeer,
  checkWerewolf,
  gameOver,
  winner,
}) => {
  if (!gameStarted) {
    return (
      <div className="rules">
        <Rules />
      </div>
    )
  } else if (gameOver && winner === 'werewolves') {
    return (
      <div className="winnerGraphic">
        <div>
          <img src="/werewolvesWin.png" />
        </div>
      </div>
    )
  } else if (gameOver && winner === 'villagers') {
    return (
      <div className="winnerGraphic">
        <div>
          <img src="/villagersWin.png" />
        </div>
      </div>
    )
  } else if (!night && localRole === 'seer' && didSeerHit) {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Luckily, no one was killed last night.
            <br />
            Now kill the werewolves before they can attack again!
            <div
              style={{
                color: '#a84ca8',
                textDecoration: 'underline',
                fontStyle: 'italic',
              }}
            >
              And, Seer, guess what...{didSeerHit} IS a werewolf!
            </div>
          </div>
        ) : (
          <div>
            {werewolfChoice} was killed during the night. Avenge{' '}
            {werewolfChoice}'s death!
            <br />
            Kill all the werewolves! <br />
            <div
              style={{
                color: '#a84ca8',
                textDecoration: 'underline',
                fontStyle: 'italic',
              }}
            >
              And, Seer, guess what...{didSeerHit} IS a werewolf!
            </div>
          </div>
        )}
      </div>
    )
  } else if (!night && localRole === 'seer' && !didSeerHit) {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Luckily, no one was killed last night.
            <br />
            Now kill the werewolves before they can attack again!
            <div style={{color: '#a84ca8', fontStyle: 'italic'}}>
              And, Seer, you guessed wrong. Better luck next time...
            </div>
          </div>
        ) : (
          <div>
            {werewolfChoice} was killed during the night. Avenge{' '}
            {werewolfChoice}'s death!
            <br />
            Kill all the werewolves! <br />
            <div style={{color: '#a84ca8', fontStyle: 'italic'}}>
              And, Seer, you guessed wrong. Better luck next time...
            </div>
          </div>
        )}
      </div>
    )
  } else if (!night) {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Luckily, no one was killed last night.
            <br />
            Now kill the werewolves before they can attack again!
          </div>
        ) : (
          <div>
            {werewolfChoice} was killed during the night. Avenge{' '}
            {werewolfChoice}'s death!
            <br />
            Kill all the werewolves!
          </div>
        )}
      </div>
    )
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    return (
      <div className="messageHeader">
        <div style={{color: 'red'}}>
          Werewolves, kill one of these filthy villagers. <br />
          They're growing too bold.
        </div>
      </div>
    )
  } else if (night && checkWerewolf && !checkSeer && localRole === 'seer') {
    return (
      <div className="messageHeader">
        <div style={{color: '#a84ca8'}}>
          Seer, choose someone to see their true identity. <br /> The answer
          will be revealed at daybreak.
        </div>
      </div>
    )
  } else if (
    night &&
    checkWerewolf &&
    checkSeer &&
    !checkMedic &&
    localRole === 'medic'
  ) {
    return (
      <div className="messageHeader">
        <div style={{color: '#4d4df1'}}>
          Medic, the werewolves have attacked! <br /> Choose someone to save!
        </div>
      </div>
    )
  } else if (night && gameStarted) {
    return (
      <div className="messageHeader">
        Sleep well, everyone. Daybreak isn't far away.
        <br /> Hope you survive the night.
      </div>
    )
  } else return null
}
export default MessageHeader
