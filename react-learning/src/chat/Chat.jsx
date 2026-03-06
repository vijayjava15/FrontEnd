import React from 'react'
import "./chat.css";
import LefsideBar from '../leftsidebar/LeftsideBar';
import Chatbox from '../chatbox/Chatbox';
import { useParams, useSearchParams } from "react-router-dom";



const Chat = () => {
  const { room } = useParams();
  const [searchParams] = useSearchParams();
  const selectedUser = searchParams.get("user")?.trim() || "";

  return (
    <div className='chat'>
      <div className="chat-container">
     <LefsideBar room={room} selectedUser={selectedUser} />
     <Chatbox room={room} peerName={selectedUser} />
      </div>
     
    </div>
  )
}

export default Chat
