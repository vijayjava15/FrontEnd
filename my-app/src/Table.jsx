import React, { useState } from 'react'

const Table = () => {




  const [user , setUser] = useState([])

  


  const addNewRow = () => {
    
  let usr = {
    usrName : '',
    age : '',
    occupation : '',
    errors: {
      usrName: false,
      age: false,
      occupation: false,
    }
  }

   const userList = [...user]
   userList.push(usr)
   setUser(userList)
    
  }

  const removeRow = (idx) => {
    console.log(idx)
    const userList = [...user] 
    userList.splice(idx, 1);
    setUser(userList)
  }

  const removeAll = () => {
    const userList = [...user]
    userList.splice(0, userList.length)
    setUser(userList)
  }

  const addValue = (index , fieldName, value) => {
    const userList = [...user]
    const obj  = {...userList[index]}
    obj[fieldName] = value
    userList[index] = obj
    setUser(userList)

  }

  const saveAll  = () => {

    const updatedUsers = user.map((usr) => ({
      ...usr,
      errors: {
        usrName: usr.usrName.trim() === '',
        age: usr.age.trim() === '',
        occupation: usr.occupation.trim() === ''
      }
    }));

    setUser(updatedUsers);

    const hasErrors = updatedUsers.some(user =>
      Object.values(user.errors).some(err => err)
    );

    if (!hasErrors) {
      alert("All data valid! Submitting...");
      console.log("Final users:", updatedUsers);
    } else {
      alert("Please fill required fields.");
    }

  }

  return (
    <div>
      <button onClick={saveAll}>save  all</button>
      <button onClick={removeAll}>remove all</button>
    <div className='container'>
   <table className='table'>
    <thead>
        <tr>
          <th>name</th>
          <th>age</th>
        <th>occupation</th>
        <th onClick={addNewRow}>+</th>
        </tr>
        
    </thead>
    <tbody>
      { user.map( ( usr , index) => 
        <tr key={index}>
        <td>
          <input type="text"  required={usr.errors.usrName} value={usr.usrName} onChange={(e) => addValue(index, "usrName", e.target.value )}/>
          {usr.errors.usrName && <span style={{ color: 'red' }}> Required</span>}
           {/* <i
          className="sidebar icon search"
          style={{ marginLeft: 8, cursor: 'pointer' }}
        
        /> */}
          </td>
        <td><input type="text"  value={usr.age} onChange={(e) => addValue(index, "age", e.target.value )}/>
        {usr.errors.age && <span style={{ color: 'red' }}> Required</span>}
        </td>
        <td><input type="text"  value={usr.occupation} onChange={(e) => addValue(index, "occupation", e.target.value )}/>
        {usr.errors.occupation && <span style={{ color: 'red' }}> Required</span>}
         </td>
        <div>
        <th onClick={(index) => removeRow(index)}>-</th>
        <th onClick={addNewRow}>+</th>
        </div>
        </tr>

      )}
    </tbody>
   </table>
    
    </div>
    
    </div>
  )
}

export default Table
