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
 * @summary Transition message showing that a majority vote has been reached
 */
export default function MajorityReached() {
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
              src="/majorityReached.png"
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
