import React, { useState } from "react";

const AddTaskBar = (props) => {
  const [task, setTask] = useState({
    id: Date.now(),
    task: "",
    empName: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const addTask = (task) => {
    props.addTask(false, task);
    setTask({
      id: Date.now(),
      task: "",
      empName: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const addtaskect = (e) => {
    const { name, value } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    props.show && (
      <div>
        <div className="modal">
          <div className="modal-content">
            <form
              action="submit"
              onSubmit={(e) => {
                e.preventDefault(); // prevent page reload
                addTask(task); // your function
              }}
            >
              <span className="close-icon" onClick={props.handleClose}>
                ×
              </span>
              <h2>Add New Task</h2>
              <input
                required={true}
                type="text"
                name="task"
                id="taskDetail"
                value={task.task}
                onChange={addtaskect}
                placeholder="Enter a Task Details"
              />
              <select
                required
                name="empName"
                id="developer"
                value={task.empName}
                onChange={addtaskect}
                className="developerDropDown"
              >
                <option value={""}></option>
                <option value={"vijay"}>Vijay</option>
                <option value={"Manju"}>Manju</option>
                <option value={"Maninthar"}> Maninthar</option>
                <option value={"Pavithra"}>Pavithra</option>
              </select>
              <input
                required
                type="date"
                name="startDate"
                value={task.startDate}
                id="startDate"
                onChange={addtaskect}
                placeholder="Task Starting Date"
              />
              <input
                required
                type="date"
                name="endDate"
                id="endDate"
                value={task.endDate}
                onChange={addtaskect}
                placeholder="Task Ending Date"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddTaskBar;
