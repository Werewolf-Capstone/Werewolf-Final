import React from 'react'

const MessageHeader = ({
  werewolfChoice,
  night,
  gameStarted,
  localRole,
  didSeerHit,
}) => {
  if (!night && localRole === 'seer' && didSeerHit) {
    return (
      <div className="messageHeader">
        {werewolfChoice === '' ? (
          <div>
            Luckily, no one was killed last night.
            <br />
            Now kill the werewolves before they can attack again!
            <div style={{color: 'red', textDecoration: 'underline'}}>
              And guess what...{didSeerHit} IS a werewolf!
            </div>
          </div>
        ) : (
          <div>
            {werewolfChoice} was killed during the night. Avenge{' '}
            {werewolfChoice}'s death!
            <br />
            Kill all the werewolves! <br />
            And guess what...{didSeerHit} IS a werewolf!
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
