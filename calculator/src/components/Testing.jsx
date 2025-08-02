import React, { useState } from 'react'

const Testing = () => {

    const[filterValue, setFilterValue] =  useState('')
 
    const data = ['apple', 'orange' , 'banana' , 'pineapple']


    const filterData = (filterValue) => {
        data.filter(value => value.includes(filterValue))

    }

  return (
    <div>
      <button  onClick={filterData(filterValue)}></button>
      <input placeholder='filterValue' 
      onChange={(e) => { setFilterValue(e.target.value)}}></input>
      <h1>{data}</h1>
    </div>
  )
}

export default Testing
