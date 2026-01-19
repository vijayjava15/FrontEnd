import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "./Constant";

const MenuList = () => {
  const [menuObj, setMenuObj] = useState({
    menuName : '',
    url : '',
    icon : '',
    description : ''

  });
  const navigate = useNavigate();

  const setValueToMenu = (field , value) => {

    setMenuObj((prevObj) =>({
      ...prevObj,
      [field]:value
    }));

  };


  const createApp = () => {
    console.log(menuObj)
    axios.post(URL+"/menu/save", menuObj)
    .then(res =>  {
      if(res.data.statusCode==='OK'){
        alert("app registered sucessfully")
      }else{
        alert(res.data.message)
      }
    }
    )

  }
  

  const redirectMenuList = ()=> {
     navigate("/menu-list")
  }

  return (
    <div className="menu-container">
      <p>Build Your App Now</p>

<div className="menuFormContainer">
      <form action="submit" method="post" className="menuForm">
        <input
          type="text"
          placeholder="App Name"
          required
          name="menuName"
          value={menuObj.menuName}
          className="form-input"
          onChange={(e) =>  setValueToMenu("menuName",e.target.value)}
        />
        <input
          type="text"
          placeholder="App Url"
          required
          name="url"
          value={menuObj.url}
          className="form-input"
           onChange={(e) =>  setValueToMenu("url",e.target.value)}
        />
        <input
          type="text"
          placeholder="App Desc"
          required
          name="description"
          value={menuObj.description}
          className="form-input"
           onChange={(e) =>  setValueToMenu("description",e.target.value)}
        />
       
        
         <input
          type="text"
          placeholder="App icon Url"
          required
          name="icon"
          value={menuObj.icon}
          className="form-input"
           onChange={(e) =>  setValueToMenu("icon",e.target.value)}
        />
      </form>
      <div className="menuSubmit">
          <button onClick={(e) => createApp()}> Create App </button>
          <p id="appText"  > <a href=""  onClick={redirectMenuList}>show apps </a> </p>
      </div>
      
    
      </div>
    </div>
  );
};

export default MenuList;
