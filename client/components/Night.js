import React from 'react'
import {Container, Box} from '@material-ui/core'

export default function Night() {
  return (
    <Container>
      {document.getElementById('background').classList.add('night')}
      {document.getElementById('background').classList.remove('day')}
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
