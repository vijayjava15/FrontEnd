import React, { useRef, useState } from 'react'

const Stopwatch = () => {
   
    const[timer,setTimer] =  useState(0)
    const[running, setRunning] = useState(false)
    const intervalRef = useRef(null)

  
  const startTimer = () => {
    if(running) return;
    setRunning(true);
    intervalRef.current =  setInterval(() => {
        setTimer(prev => prev+1)
    },500
    )
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }

  const resetTimer  = ()=> {
     clearInterval(intervalRef.current)
       setRunning(false)
       setTimer(0)
  }
  return (
    <div>
      <h1>Time : {timer} S</h1>
      <div className="buttons">
        <button onClick={startTimer}>start</button>
        <button onClick={stopTimer}> stop</button>
        <button onClick={resetTimer}>reset</button>
      </div>
    </div>
  )
}

export default Stopwatch
