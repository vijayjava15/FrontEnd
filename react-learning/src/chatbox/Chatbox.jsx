import React, { useContext } from 'react'

import "./chatbox.css"
import assets from '../assets/assets'
import { UserContext } from '../UserProvider';

const Chatbox = (props ) => {

   const {username} = useContext(UserContext);
   

  return (
    <div className='chatbox'>
     
       <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>{username} <img src={assets.green_dot}></img></p>
        <img src={assets.help_icon} alt="" />

       
        </div> 
    </div>
  )
}

export default Chatbox
