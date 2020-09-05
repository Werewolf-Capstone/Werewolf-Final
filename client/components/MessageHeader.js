import React from 'react'

const MessageHeader = ({werewolfChoice}) => {
  if (werewolfChoice === '') {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Thankfully, no one was killed last night.
            <br />
            Kill those werewolves before they can attack again!
          </div>
        ) : (
          <div>
            {werewolfChoice} was killed during the night. Avenge{' '}
            {werewolfChoice}'s death!
            <br />
            Kill those werewolves!
          </div>
        )}
      </div>
    )
  }
}

export default MessageHeader
