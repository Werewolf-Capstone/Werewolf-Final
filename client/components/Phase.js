import React from 'react'
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
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
      <Container>
        <Box display="flex" justifyContent="center" className="fadeIn animated">
          {night ? (
            !checkWerewolf && localRole !== 'werewolf' ? (
              <img
                src="/werewolvesVoting.png"
                alt="Werewolves are voting"
                width="50%"
                height="50%"
              />
            ) : (
              ''
            )
          ) : (
            ''
          )}

          {/* <img
            src="/werewolvesVoting.png"
            alt="Werewolves are voting"
            width="50%"
            height="50%"
          /> */}

          {/* {() => {
            switch (step) {
              case 'werewolves':
                return (
                  <img
                    src="/werewolvesVoting.png"
                    alt="Werewolves are voting"
                    width="50%"
                    height="50%"
                  />
                )
              case 'seer':
                return (
                  <img
                    src="/Seer.png"
                    alt="Seer is now seeing"
                    width="50%"
                    height="50%"
                  />
                )
              case 'medic':
                return (
                  <img
                    src="/medic.png"
                    alt="Seer is now seeing"
                    width="50%"
                    height="50%"
                  />
                )
              case 'majorityReached':
                return (
                  <img
                    src="/majorityReached.png"
                    alt="Seer is now seeing"
                    width="50%"
                    height="50%"
                  />
                )
              default:
                return null
            }
          }} */}
        </Box>
      </Container>
    </Backdrop>
  )
}
