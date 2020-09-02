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
    <Container
      id="landing-page-container"
      display="flex"
      maxWidth="sm"
      flexdirection="column"
      justifycontent="center"
    >
      <Box display="flex" justifycontent="center" alignItems="center">
        <h2>Enter a room</h2>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box marginTop="2%">
          <label htmlFor="name"></label>
          <TextField
            type="text"
            id="field"
            variant="filled"
            color="secondary"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Box>

        <Box marginTop="2%">
          <label htmlFor="room"></label>
          <TextField
            type="text"
            id="room"
            variant="filled"
            color="secondary"
            placeholder="Room Name"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </Box>

        <Box display="flex" justifycontent="center" marginTop="2%" width="100%">
          <Button type="submit" variant="outlined" color="secondary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  )
}

export default Lobby
