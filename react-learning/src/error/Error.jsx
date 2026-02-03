import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../Constant";

const Error = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  const changePage = () => {
    navigate("/create-error");
  };

  useEffect(() => {
    axios.post(URL + "/error/get").then((res) => {
      console.log(res)
      setErrors(res.data);
    });
  },[]);

  return (
    <div className="container-fluid p-4">
      <div className="fw-bold fs-3 mb-4 text-primary">Error ManageMent</div>
      <div>
        <button onClick={changePage}>Create New Error</button>
      </div>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label fw-semibold mb-2">Date</label>
          <input type="date" className="form-control" />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold mb-2">Error Type</label>
          <select className="form-select">
            <option></option>
            <option>YES</option>
            <option>NO</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label fw-semibold mb-2">Fully Updated</label>
          <select className="form-select">
            <option></option>
            <option>YES</option>
            <option>NO</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label fw-semibold mb-2">Is Learned</label>
          <select className="form-select">
            <option></option>
            <option>YES</option>
            <option>NO</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label fw-semibold mb-2">Is Important</label>
          <select className="form-select">
            <option></option>
            <option>YES</option>
            <option>NO</option>
          </select>
        </div>
      </div>
      <div className="row">
        {errors.map((err, index) => (
          <div className="col-6">
            <div className="bg-white rounded p-2 mb-2">
              <textarea name="error" id="error" value={err.error}></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Error;
