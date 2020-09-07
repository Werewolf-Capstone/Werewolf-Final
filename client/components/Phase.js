/* eslint-disable complexity */
import React, {useEffect} from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import {makeStyles} from '@material-ui/core/styles'
import {Container, Box, Fade} from '@material-ui/core'

import Zoom from '@material-ui/core/Zoom'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

export default function Phase({
  night,
  localRole,
  checkWerewolf,
  checkMedic,
  checkSeer,
  majorityReached,
  gameOver,
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)

  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    console.log('do we make it here??????????????????')
    setOpen(true)
  }

  useEffect(() => {
    setOpen(true)
    console.log('setting open back to true in use effect')
  }, [night, checkWerewolf, checkSeer])

  return (
    <Container>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <Box display="flex" justifyContent="center">
          {gameOver ? (
            ''
          ) : night ? (
            !checkWerewolf ? (
              localRole !== 'werewolf' ? (
                <Zoom in={true} style={{transitionDuration: '2000ms'}}>
                  <img
                    src="/werewolvesVoting.png"
                    alt="Werewolves are voting"
                    width="50%"
                    height="50%"
                  />
                </Zoom>
              ) : (
                ''
              )
            ) : !checkSeer ? (
              localRole !== 'seer' ? (
                <Zoom in={true} style={{transitionDuration: '2000ms'}}>
                  <img
                    src="/Seer.png"
                    alt="Seer is now seeing"
                    width="50%"
                    height="50%"
                  />
                </Zoom>
              ) : (
                ''
              )
            ) : !checkMedic ? (
              localRole !== 'medic' ? (
                <Zoom in={true} style={{transitionDuration: '2000ms'}}>
                  <img
                    src="/medic.png"
                    alt="Medic is now healing"
                    width="50%"
                    height="50%"
                  />
                </Zoom>
              ) : (
                ''
              )
            ) : (
              ''
            )
          ) : majorityReached ? (
            <Zoom in={true} style={{transitionDuration: '2000ms'}}>
              <img
                src="/majorityReached.png"
                alt="A majority has been reached"
                width="50%"
                height="50%"
              />
            </Zoom>
          ) : null}
        </Box>
      </Backdrop>
    </Container>
  )
}
