import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
//import SideBarData from "./SideBarData";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserProvider";
import { URL } from "./Constant";

const SideBar = () => {
  const navigate = useNavigate();

  const { logoutUser } = useContext(UserContext);

  const [sideBarData, setSideBarData] = useState([]);
  // const [sideBar, setSideBar] = useState({
  //   menuName : '',
  //   icon  : ''
  // })

  const removeUserName = () => {
     logoutUser();
     navigate('/login');

  };

  useEffect(() => {
    axios.get(URL+"/menu/getMenus").then((res) => {
      console.log(res);

      const sideBarList = [];
      res.data.data.map((obj) => {
        const sideBar = {
          menuName: obj.menuName,
          icon: obj.icon,
          url: obj.url,
        };

        sideBarList.push(sideBar);
      });
      setSideBarData(sideBarList);
      console.log(sideBarList);
    });
  }, []);

  return (
    <div className="sideBar">
      <ul className="sideBarList">
        {sideBarData.map((value, key) => {
          return (
            <li className="row" onClick={() => navigate("/" + value.url)}>
              {"  "}
              <div className="menu">
                <i class={value.icon}></i>
                <p>{value.menuName} </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="signout-button">
        <button onClick={removeUserName}>Log Out</button>
      </div>
    </div>
  );
};

export default SideBar;
