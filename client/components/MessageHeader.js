import React from 'react'
import Participant from './Participant'

const MessageHeader = ({werewolfChoice, night, gameStarted}) => {
  if (!night) {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Luckily, no one was killed last night.
            <br />
            Kill those werewolves before they can attack again!
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
  } else if (night && gameStarted) {
    return (
      <div className="messageHeader">
        Sleep well, everyone.
        <br /> Hope you survive the night.
      </div>
    )
  } else return <div className="messageHeader"></div>
}

export default MessageHeader
