import { useState } from 'react'
import './App.css'

import LoginPage from './LoginPage'
import Testing from './Testing'
import Table from './Table'
import ProfileCard from './profileCard'
import ProfileCardForm from './ProfileCardForm'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div style={{ display: 'flex' }}> 
  
  
    <ProfileCard/>
    
   
   </div>
  )
}

export default App
