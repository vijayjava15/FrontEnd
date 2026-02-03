import React, { useState } from "react";
import "./AddError.css";
import axios from "axios";
import { URL } from "../Constant";

const AddError = () => {
  const [error, setError] = useState({
    error: "",
    errorType: "",
    topicsCovered: "",
    isLearned: "",
  });

  const selectValue = (value, field) => {
    setError((prev) => ({
      ...prev,
      [field]: value,
    }));

    console.log(error)
  };




  const saveError = () => {
    axios.post(URL+"/error/save", error)
    .then(res => console.log(res))
  }

  return (
    <div className="add-error-container">
      <h2 className="page-title">Create New Error</h2>

      <div className="error-card">
        <form>
          {/* Error Message */}
          <div className="form-group">
            <label>Error Message</label>
            <textarea
              rows="4"
              placeholder="Copy your error here"
              value={error.error}
              onChange={(e) => selectValue(e.target.value, "error")}
            />
          </div>

          {/* Error Type */}
          <div className="form-group">
            <label>Error Type</label>
            <select onChange={(e) => selectValue(e.target.value, "errorType")}>
              <option value="">Select Error Type</option>
              <option value="BACKEND">BACKEND</option>
              <option value="FRONTEND">FRONTEND</option>
              <option value="DB">DB</option>
              <option value="CLOUD">CLOUD</option>
            </select>
          </div>

          {/* AI Description */}
          <div className="form-group">
            <label>AI Description</label>
            <textarea rows="3" placeholder="AI generated description" />
          </div>

          {/* Topics */}
          <div className="form-group">
            <label>Topics</label>
            <input
              type="text"
              placeholder=" related topics to learn(Comma Separated)"
              onChange={(e) => selectValue(e.target.value, "topicsCovered")}

            />
          </div>

          {/* Checkboxes */}
          <div className="checkbox-group">
            <label>
              <input type="checkbox" /> Fully Updated
            </label>

            <label>
              <input type="checkbox" /> Is Learned
            </label>

            <label>
              <input type="checkbox" /> Is Important
            </label>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button className="btn-primary" onClick={saveError}>Save Error</button>
            <button className="btn-primary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddError;
