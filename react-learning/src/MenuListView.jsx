import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "./Constant";

const MenuListView = () => {
  const [menuList, setMenuList] = useState([]);

  

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    axios.get(URL+"/menu/getMenus").then((res) => {
      console.log(res);
      const dataList = [];
      setMenuList(res.data.data);
    });
  }, []);

  const handleUpdate = (index, field, value) => {
    const menuDatas = [...menuList]
    menuDatas[index][field] = value
    setMenuList(menuDatas)
  };


  const upDateMenu = (idx) => {
    const menuDatas = [...menuList]
    const menuObj = menuDatas[idx] 
    console.log(menuObj)
    axios.post(URL+'/menu/save', menuObj)
    .then(res =>  {
      if(res.data.statusCode==='OK'){
        alert("app updated sucessfully")
        setEdit(null)
      }else{
        alert(res.data.message)
      }
    }
    )

  }

  const updateEditButton = (idx) => {
    setEdit(idx);
  };

  return (
    <div className="menu-list-view">
      <h3 className="menuViewHeader">Menu details</h3>
      <table border="1">
        <tr>
          <th>S No</th>
          <th>App Name</th>
          <th>App Icon</th>
          <th>app Url</th>
          <th>Action </th>
        </tr>
        <tbody>
          {menuList.map((menu, idx) => (
            <tr>
              <td>{idx + 1}</td>
              <td>
                {edit === idx ? (
                  <input
                    value={menu.menuName}
                    type="text"
                    onChange={(e) =>
                      handleUpdate(idx, "menuName", e.target.value)
                    }
                  />
                ) : (
                  menu.menuName
                )}
              </td>
              <td>
                {edit === idx ? (
                  <input
                    value={menu.icon}
                    type="text"
                    onChange={(e) =>
                      handleUpdate(idx, "icon", e.target.value)
                    }
                  />
                ) : (
                  menu.icon
                )}
              </td>
              <td>
                {edit === idx ? (
                  <input
                    value={menu.url}
                    type="text"
                    onChange={(e) =>
                      handleUpdate(idx, "url", e.target.value)
                    }
                  />
                ) : (
                  menu.url
                )}
              </td>
              <td>
                <button onClick={(e) => updateEditButton(idx)}>edit</button>{" "}
                <button onClick={(e) => upDateMenu(idx)}>save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuListView;
