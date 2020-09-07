/* eslint-disable complexity */
import React, {useEffect} from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import {makeStyles} from '@material-ui/core/styles'
import {Container, Box} from '@material-ui/core'

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

  useEffect(() => {
    setOpen(true)
    console.log('setting open back to true in use effect')
  }, [night])

  return (
    <Container>
      <Box display="flex" justifyContent="center" className="fadeIn animated">
        {gameOver ? (
          ''
        ) : night ? (
          !checkWerewolf ? (
            localRole !== 'werewolf' ? (
              <img
                src="/werewolvesVoting.png"
                alt="Werewolves are voting"
                width="50%"
                height="50%"
              />
            ) : (
              ''
            )
          ) : !checkSeer ? (
            localRole !== 'seer' ? (
              <img
                src="/Seer.png"
                alt="Seer is now seeing"
                width="50%"
                height="50%"
              />
            ) : (
              ''
            )
          ) : !checkMedic ? (
            localRole !== 'medic' ? (
              <img
                src="/medic.png"
                alt="Medic is now healing"
                width="50%"
                height="50%"
              />
            ) : (
              ''
            )
          ) : (
            ''
          )
        ) : majorityReached ? (
          <img
            src="/majorityReached.png"
            alt="A majority has been reached"
            width="50%"
            height="50%"
          />
        ) : null}
      </Box>
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={handleClose}
      ></Backdrop>
    </Container>
  )
}
