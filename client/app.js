import React from 'react'

import VideoChat from './components/VideoChat'

import '@babel/polyfill'
import {TextField, Container, Button, Box} from '@material-ui/core'

const App = () => {
  return (
    <div className="app">
      <header>
        {/* <h1 id="werewolf-title" className="fadeInUp animated">
          Werewolf Chat
        </h1> */}
        {/* <Container>
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
        </Container> */}
      </header>

      <main>
        <VideoChat />
      </main>
    </div>
  )
}

export default App
