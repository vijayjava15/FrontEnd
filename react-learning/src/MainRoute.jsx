import React, { useState } from 'react'
import SideBar from './SideBar';
import Deployment from './Deployment';
import VideoDownLoad from './VideoDownLoad';
import QuizApp from './QuizApp';
import Stopwatch from './Stopwatch';
import Counter from './Counter';
import MenuListView from './menuListView';
import { Navigate, Route, Routes } from 'react-router-dom';
import Course from './Course';
import TaskBar from './TaskBar';
import Login from './login/Login';
import Chat from './chat/Chat';
import MenuList from './MenuList';

const MainRoute = () => {

    
      const [courses, setCourses] = useState([
        { id: 1, name: "Html", price: "500$" },
        { id: 2, name: "Java", price: "600$" },
        { id: 3, name: "Spring boot", price: "300$" },
        { id: 4, name: "node js", price: "399$" },
      ]);
    
      const deleteCourse = (id) => {
        setCourses(courses.filter((course) => course.id !== id));
      };

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <div className='main-screen'>
        { /* {location.pathname !=='/login'  && (  */}
          <div className='side-bar-screen'>
            <SideBar />
          </div>
       { /*  )} */}
     

          {/* Main Content */}
          <div className='main-content' >
            <Routes>
              <Route path="/taskPlanner" element={<TaskBar />} />
              <Route
                path="/course"
                element={
                  <div>
                    {courses.map(course => (
                      <Course
                        key={course.id}
                        deleteCourse={deleteCourse}
                        name={course.name}
                        id={course.id}
                        price={course.price}
                      />
                    ))}
                  </div>
                }
              />
              <Route path="/deployment" element={<Deployment />} />
              <Route path="/download" element={<VideoDownLoad />} />
               <Route path="/quiz" element={<QuizApp />} />
                <Route path="/stopwatch" element={<Stopwatch />} />
                 <Route path="/count" element={<Counter />} />
                 <Route path='/login' element={<Login />} />
                  <Route path='/chat' element={<Chat />} />
                   <Route path='/menu' element={<MenuList />}/>
                    <Route path='/menu-list' element={<MenuListView />}/>
                   
            </Routes>
          </div>
    </div>
  )
}

export default MainRoute
