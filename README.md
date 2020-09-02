# Werewolf
An multiplayer, P2P video streaming web application based on the social-deduction party game "Werewolf" (with a commonly known variation called "Mafia"). 

## Tech Stack
### Front End:
- Functionality: React
- Styling: MaterialUI
- Animations: AniJS
### Audio/Video Streaming:
- Twilio API
(We refactored to Twilio API from an original version that was built on WebRTC and PeerJS. Unfortunately, the latency in the streams became quite high after adding only a handful of users, and we had to pivot the approach for a smoother user experience.)
### Back End:
- Firebase (we used Firestore as our real-time, NoSQL database for fast lookup of game room status)
- Express (to connect our front end to Firebase)
### Boilermaker:
We used bits and pieces of Fullstack Academy's boilermaker code to set up the express server, and WebPack configuration.
(Since the code was forked over, our team size looks like it's 24 instead of the 4 who actually worked on the app -- contributors listed below)

## Features
### No Moderator Needed
Unlike in the traditional game, you no longer need a moderator to run the game. The prompts on the screen make it clear whose turn it is to act next, meaning that the whole party can get in on the fun. Once a majority of players have opted to eliminate a single player, their votes will be made official and the game will continue to flow.

### Controlled Streams
When it's time for the werewolves to collaborate on choosing their next victim, the rest of the streams will be cut off, meaning that they can collaborate in secret without requiring other players to close their eyes like in the in-person game. 

### Easy-to-Use User Interface
In order to facilitate ease-of-use, we've opted for not requiring login credentials for users -- simply set your username, and join a room!

### Animations
MaterialUI and AniJS provide us with a countless styling and animation features that, coupled with some custom page designs, give you the authentic "Werewolf" feel

## Contributors:
- Jonathan Albert (JAlbertCode)
- Aleks Mitrovic (babybear4812)
- Michael Pesek (mpesek4)
- Cameron Holsinger (echolsinger)
