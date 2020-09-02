import React from 'react'

import VideoChat from './components/VideoChat'

import '@babel/polyfill'

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Werewolf Chat</h1>
      </header>
      <main>
        <VideoChat />
      </main>
    </div>
  )
}

export default App
