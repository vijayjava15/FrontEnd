import React, { useEffect, useState } from "react";

const Course = (props) => {
  const [purchased, setPurchased] = useState(false);
  const course1 = "Html";
  

  const buyCourse = () => {
    alert("sucessFully purchased A Course");
    setPurchased(true);
  };

   useEffect(() => {
   
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => {console.log(res)
      return  res.json()
    }).then(data => console.log(data))
   },[])

  return (
    <div className="card">
      <img
        src="https://i.ytimg.com/vi/mJgBOIoGihA/maxresdefault.jpg"
        alt="htmlCourseImage"
      />
      <h3>{props.name}</h3>
      <p>{props.price}</p>
      {purchased ? (
        <div>
        <p> course already purchased </p>
     
        </div>
      
      ) : (
        <button onClick={buyCourse}>Buy Now</button>
      )}
     <button onClick={() => props.deleteCourse(props.id)}> Delete Course </button>
    </div>
  );
};

export default Course;
