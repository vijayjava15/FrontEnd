import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Course from './Course';
import TaskBar from './TaskBar';
import SideBar from './SideBar';
import Deployment from './Deployment';
import { Download } from '@mui/icons-material';
import VideoDownLoad from './VideoDownLoad';
import QuizApp from './QuizApp';
import Stopwatch from './Stopwatch';
import Counter from './Counter';
import Login from './login/Login';
import Chat from './chat/Chat';
import MenuList from './MenuList';

function App() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Html', price: '500$' },
    { id: 2, name: 'Java', price: '600$' },
    { id: 3, name: 'Spring boot', price: '300$' },
    { id: 4, name: 'node js', price: '399$' }
  ]);

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

 return (
    <div className="App">
      <Router>
   
          {/* Sidebar */}
          <div style={{ width: "200px" }}>
            <SideBar />
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: "20px" }}>
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
                 <Route path='/chatApp' element={<Login />} />
                  <Route path='/chat' element={<Chat />} />
                   <Route path='/menu' element={<MenuList />}/>
            </Routes>
          </div>
  
      </Router>
     
    </div>
  );
}
export default App;
