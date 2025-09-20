import React, { useState } from "react";
import AddTaskBar from "./AddTaskBar";

const TaskBar = () => {
  const [show, setShow] = useState(false);

  const [task, setTask] = useState([]);

  const addTask = (flag, taskObj) => {
    const tasks = [...task];
    tasks.push(taskObj);
    console.log(flag);
    console.log(tasks);
    setTask(tasks);
    setShow(flag);
  };

  const openTask = (flag) => {
    setShow(flag);
  };

  const deleteTask = (index) => {
    setTask((prev) => {
      return prev.filter((task) => task.id != index);
    });
  };


  const handleClose = () => {
    setShow(false)
  }

  return (
    <div className="mainContainer">
      <AddTaskBar
        show={show}
        addTask={(flag, taskObj) => addTask(flag, taskObj)}
        handleClose  = {handleClose}
      />
      <button onClick={() => openTask(true)}>Add Task </button>

    
          <div className="container">
              {task &&
        task.map((tk, index) => (
            <div className="taskCard">
              <div className="taskHeader">
                
                <h3>{tk.task}</h3>
              </div>

              <h3>{tk.empName}</h3>
              <div className="taskStatus">
                <select className="statusBar">
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Open</option>
                  <option>Re Openend</option>
                </select>
                <p>{tk.startDate}</p>
                <p>{tk.endDate}</p>
            
              </div>
              <button onClick={() => deleteTask(tk.id)} className="deleteTask">
                Delete task
              </button>
            </div>
             ))}
          </div>
       
        
    </div>
  );
};

export default TaskBar;
