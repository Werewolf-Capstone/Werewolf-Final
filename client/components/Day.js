import React from 'react'
import {Container} from '@material-ui/core'

export default function Day({night}) {
  return (
    <Container>
      {night ? (
        <div>
          {document.getElementById('background').classList.add('night')}
          {document.getElementById('background').classList.remove('lobby')}
          {document.getElementById('background').classList.remove('day')}
        </div>
      ) : (
        <div>
          {document.getElementById('background').classList.add('day')}
          {document.getElementById('background').classList.remove('lobby')}
          {document.getElementById('background').classList.remove('night')}
        </div>
      )}
    </Container>
  )
}
