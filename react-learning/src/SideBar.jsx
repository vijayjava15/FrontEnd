import React from "react";
import SideBarData from "./SideBarData";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
        const navigate = useNavigate();
  return (

  
    <div className="sideBar"  >
      <ul className="sideBarList">
        {SideBarData.map((value, key) => {
          return (

            <li className="row" onClick={ () => navigate(value.url)}>
                {"  "}
                <div className="menuName"> {value.name}  </div>
                <div className="icon">{value.icon}</div>
                </li>

          )
            
          
        })}
      </ul>
    </div>
  );
};

export default SideBar;
