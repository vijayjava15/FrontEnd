import React from 'react'
import "./chat.css";
import LefsideBar from '../leftsidebar/LeftsideBar';
import Chatbox from '../chatbox/Chatbox';



const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
     <LefsideBar/>
     <Chatbox/>
      </div>
     
    </div>
  )
}

export default Chat
