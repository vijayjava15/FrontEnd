import React from 'react'

const ProfileCardForm = () => {
  return (
    <div className='formDiv'>
     
      <form action="submit">

       <input type="text" name="name" id="name"  placeholder='name'/>
       <input type="text" name="name" id="name" placeholder='profession' />
       <input type="text" name="name" id="name"  placeholder='linkedIn Profile'/>
       <input type="text" name="name" id="name"  placeholder='number'/>
       <input type="text" name="name" id="name" placeholder='imageUrl'/>
      
      </form>
      <button>submit</button>
    </div>
  )
}

export default ProfileCardForm
