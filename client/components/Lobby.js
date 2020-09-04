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
    <div>
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          marginTop="7%"
          marginBottom="5%"
          className="fadeInUp animated"
        >
          <img
            src="/werewolfTitle.png"
            alt="Werewolf"
            width="50%"
            height="50%"
          />
        </Box>
      </Container>
      <Container
        id="landing-page-container"
        display="flex"
        maxWidth="sm"
        flexdirection="column"
        className="fadeIn2 animated"
      >
        <Box textAlign="center">
          <h2>Enter a room</h2>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box marginTop="2%" textAlign="center">
            <label htmlFor="name"></label>
            <TextField
              className="input"
              type="text"
              id="field"
              variant="outlined"
              color="secondary"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </Box>

          <Box marginTop="2%" textAlign="center">
            <label htmlFor="room"></label>
            <TextField
              className="input"
              type="text"
              id="room"
              variant="outlined"
              color="secondary"
              placeholder="Room Name"
              value={roomName}
              onChange={handleRoomNameChange}
              required
            />
          </Box>

          <Box display="flex" justifyContent="center" marginTop="2%">
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              size="large"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    </div>
  )
}

export default Lobby
