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

/**
 * @summary Component to display animation and image of werewolves winning
 */
export default function WerewolvesWin() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            className="fadeIn animated"
          >
            <img
              src="/WerewolvesWin.png"
              alt="Werewolf"
              width="50%"
              height="50%"
            />
          </Box>
        </Container>
      </Backdrop>
    </div>
  )
}
