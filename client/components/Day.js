import React from 'react'
import {Container, Box} from '@material-ui/core'

export default function Day() {
  return (
    <Container>
      {document.getElementById('background').classList.add('day')}
      {document.getElementById('background').classList.remove('lobby')}
      <Box
        display="flex"
        justifyContent="center"
        marginTop="7%"
        marginBottom="5%"
        className="fadeIn animated"
      >
        <img src="/dayTime.png" alt="Werewolf" width="30%" height="30%" />
      </Box>
    </Container>
  )
}
