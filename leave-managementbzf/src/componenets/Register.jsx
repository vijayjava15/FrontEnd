import React, { useState } from "react";

const Register = () => {
  const [employee, setEmployee] = useState({
    employeeName: "",
    dob: "",
    address: "",
    jobTitle: "",
    email: "",
    phoneNumber: "",
    joiningDate: "",
    companyId: ""
  });

  const submitEmployee = (obj) => {
    fetch("localhost:2002/api/admin/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: obj,
    })
      .then((res) => {
        if (res == 200) {
          console.log("employee created sucessFully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnChange =  () => {
    set

  }

  return (
    <div className="mainDiv">
      <form action="submit" className="regForm">
        <h1 className="headerTitle"> EmployeeForm </h1>
        <input className="regInput" placeholder="Employee Name" name="employeeName" value={employee.employeeName} onChange={handleOnChange} disabled ={false} />
        <input className="regInput" placeholder="DOB" name="dob" value={employee.dob} onChange={handleOnChange} />
        <input className="regInput" placeholder="address" name="address" value={employee.address} onChange={handleOnChange} />
        <input className="regInput" placeholder="Job Title" />
        <input className="regInput" placeholder="Email"  name="email" value={employee.email} onChange={handleOnChange}  />
        <input className="regInput" placeholder="PhoneNumber"  name="phoneNumber" value={employee.phoneNumber} onChange={handleOnChange} />
        <input className="regInput" placeholder="Joining Date" name="joiningDate" value={employee.joiningDate} onChange={handleOnChange}  />
        <input className="regInput" placeholder="Company" name="company" value={employee.companyId}  onChange={handleOnChange} />
        <button className="buttonBig" onClick={submitEmployee} onChange={handleOnChange} >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
