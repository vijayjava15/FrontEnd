import { useContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  
} from "react-router-dom";
import "./App.css";
import Course from "./Course";
import TaskBar from "./TaskBar";
import SideBar from "./SideBar";
import Deployment from "./Deployment";
import { Download } from "@mui/icons-material";
import VideoDownLoad from "./VideoDownLoad";
import QuizApp from "./QuizApp";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";
import Login from "./login/Login";
import Chat from "./chat/Chat";
import MenuList from "./MenuList";
import MenuListView from "./MenuListView";
import { UserContext } from "./UserProvider";
import MainRoute from "./MainRoute";

function App() {
  //const location = useLocation();


  useEffect(() => {}, []);

  return (
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<MainRoute />} />
        </Routes>
    </div>
  );
}
export default App;
