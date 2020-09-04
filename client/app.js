import React from 'react'

import VideoChat from './components/VideoChat'

import '@babel/polyfill'

const App = () => {
  return (
    <div className="app">
      <header></header>

      <main>
        <VideoChat />
      </main>
    </div>
  )
}

export default App
