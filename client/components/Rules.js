import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function Rules() {
  const [open, setOpen] = React.useState(false)
  const [fullWidth] = React.useState(true)
  const [maxWidth] = React.useState('md')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={handleClickOpen}
      >
        Rules
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title" className="dialog">
          {/* RULES */}
        </DialogTitle>
        <DialogContent className="dialog">
          <DialogContentText>
            The game proceeds in alternating night and day rounds, beginning
            with night.
          </DialogContentText>
          {/* <DialogContentText>The Night</DialogContentText> */}
          <DialogContentText>
            In the beginning of the night only the werewolves can see. Everyone
            else is sleeping and so their video is stopped. While everyone
            sleeps the werewolves will choose a villager to kill. When the
            werewolves have made their kill, they too sleep.
          </DialogContentText>
          <DialogContentText>
            After the werewolves have made their kill, the village Doctor
            awakens and, not knowing who has been killed, chooses a villager
            (which can be themself) to heal. The villager chosen will survive
            the night if the werewolves chose to kill them. Once the Doctor has
            made their choice, they go back to sleep.
          </DialogContentText>
          <DialogContentText>
            Next, the village Seer awakens. The Seer can choose one villager to
            have their true identity revealed. If the villager chosen is a
            werewolf, the Seer will be told so. Otherwise the Seer returns to
            sleep.
          </DialogContentText>
          <DialogContentText>
            Once the Seer has finished we transition to daytime and the
            villagers find out who has been killed during the night. That
            villager is immediately dead and out of the game. They do not reveal
            their identity.
          </DialogContentText>
          <DialogContentText>
            Daytime is very simple; all the living villagers gather and decide
            who to kill in hopes of ridding themselves of werewolves. As soon as
            a majority votes for a single villager to kill, that villager is
            immediately dead and out of the game.
          </DialogContentText>
          <DialogContentText>
            There are no restrictions on speech. Any living villager can say
            anything they want -- truth, misdirection, nonsense, or a barefaced
            lie. Dead villagers may not speak at all. If a villager senses the
            other villagers are beginning to turn on them and they want to
            protest their innocence or reveal some information (like the Seer's
            visions), they must do it before the votes go through.
          </DialogContentText>
          <DialogContentText>
            Once a player is killed, night falls and the cycle repeats.{' '}
          </DialogContentText>
          <DialogContentText>Winning:</DialogContentText>
          <DialogContentText>
            The villagers win if they kill all of the werewolves.
          </DialogContentText>
          <DialogContentText>
            The werewolves win if they kill enough villagers so that the numbers
            are even. (Example: Two werewolves and two villagers)
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog">
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
