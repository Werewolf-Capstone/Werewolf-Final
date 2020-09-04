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

export default function MajorityReached() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleToggle}>
        Show backdrop
      </Button> */}
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        {/* <CircularProgress color="inherit" /> */}
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            marginTop="7%"
            marginBottom="5%"
            className="fadeIn animated"
          >
            <img
              src="/majorityReached.png"
              alt="Werewolf"
              width="30%"
              height="30%"
            />
          </Box>
        </Container>
      </Backdrop>
    </div>
  )
}
