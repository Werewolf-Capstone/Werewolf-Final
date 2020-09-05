import React from 'react'

const MessageHeader = ({werewolfChoice, night}) => {
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
  }
  return null
}

export default MessageHeader
