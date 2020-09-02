import React from 'react'
import {TextField, Container, Button, Box} from '@material-ui/core'

const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
}) => {
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h2>Enter a room</h2>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="field"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <div>
          <label htmlFor="room">Room name:</label>
          <input
            type="text"
            id="room"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </Container>
  )
}

export default Lobby
