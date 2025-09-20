import React, { useState } from 'react'

const Counter = () => {

   const [count, setCount ] = useState(0)


   const clickButton = () => {
    setCount(prev =>  prev+1)
   }

  return (
    <div>
      <h3> count is {count}</h3>
      <button onClick={clickButton}>increase Count</button>
    </div>
  )
}

export default Counter
