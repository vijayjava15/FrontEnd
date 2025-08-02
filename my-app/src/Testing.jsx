import React, { useState } from 'react'

const Testing = () => {

    const[filterValue, setFilterValue] =  useState('')

    let value = 'hai   '+  '/n     '  +  'hello'
 
    const [data, setData] = useState(['apple', 'orange' , 'banana' , 'pineapple'])


    const filterData = (filterValue) => {
       
        const result = data.filter(value =>
            value.includes(filterValue)
          );
          setData(result);
    }

  return (
    <div>
      <button  onClick={filterData}> filter</button>
      <br></br>
      <input style={{width:'400px', height:"200px"}} 
      onChange={(e) => { setFilterValue(e.target.value)}}></input>
      <h1>{data}</h1>
      <textarea> {value} </textarea>
    </div>
  )
}

export default Testing
