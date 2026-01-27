import React, { useContext, useEffect, useRef, useState } from 'react'

import "./chatbox.css"
import assets from '../assets/assets'
import { UserContext } from '../UserProvider';

const Chatbox = (props ) => {

   const {username} = useContext(UserContext);
    const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8082/chat/" +"vijay" + "/sendMessage");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socketRef.current.onerror = (err) => {
      console.log("WebSocket error", err);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(text);
      setText("");
    }
  };


  return (
    <div className='chatbox'>
     
       <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>{username} <img src={assets.green_dot}></img></p>
        <img src={assets.help_icon} alt="" />

  
       
        </div> 

        <div className="message">
           <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>

      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
        </div>
    </div>
  )
}

export default Chatbox
