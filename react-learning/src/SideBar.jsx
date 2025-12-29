import axios from "axios";
import React, { useEffect, useState } from "react";
//import SideBarData from "./SideBarData";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
        const navigate = useNavigate();

        const [sideBarData, setSideBarData] = useState([])
        // const [sideBar, setSideBar] = useState({
        //   menuName : '',
        //   icon  : ''
        // })


      
        
      

   useEffect( () => {
     axios.get("http://localhost:8082/menu/getMenus")
     .then( res => {
      console.log(res)
    
      const sideBarList = []
      res.data.data.map(obj => {
        
        const sideBar = {
          menuName : obj.menuName,
          icon : obj.icon,
          url : obj.url
        }

        sideBarList.push(sideBar)
      })
     setSideBarData(sideBarList)
      console.log(sideBarList)
     })
      
   },[])  

  return (

  
    <div className="sideBar"   >
      <ul className="sideBarList">
        {sideBarData.map((value, key) => {
          return (
            
            <li className="row" onClick={ () => navigate(value.url)}>
                {"  "}
                 <div className="menu"> 
                  <i class={value.icon}></i> 
                  <p>{value.menuName} </p>
                  </div>
 
               
                </li>

          )
            
          
        })}
      </ul>
    </div>
  );
};

export default SideBar;
