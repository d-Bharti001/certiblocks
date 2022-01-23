import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import BackendProvider from './contexts/BackendContext'
import Navigation from './components/Navigation'
import Homepage from './components/Homepage'
import Dashboard from './components/Dashboard'
import Certify from './components/Certify'
import Verify from './components/Verify'
import Register from './components/Register'

function App() {
  return (
    <div className='App'>
      <CssBaseline />
      <BackendProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='certify' element={<Certify />} />
            <Route path='verify' element={<Verify />} />
            <Route path='register' element={<Register />} />
            <Route
              path='*'
              element={
                <main style={{ padding: '1rem' }}>
                  <p>Wrong URL path! There's nothing here.</p>
                </main>
              }
            />
          </Routes>
        </Router>
      </BackendProvider>
    </div>
  )
}

export default App
