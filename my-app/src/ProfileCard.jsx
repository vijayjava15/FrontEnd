import React from "react";

const ProfileCard = () => {
  return (
    <div className="container">
      <div className="cardDiv">
        <div className="photoName">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYsKYYUM0RIA8iUf103MxyuhWOq-5MPnNYsVcIsjhqgZJAWn4CPGrnojS0VbxENA_xNPk&usqp=CAU"
            alt="idPhoto"
            className="photo"
          />
          <p className="name">Kristeena V</p>
        </div>
        <div className="details">
          <p>Software Engineer</p>
          <p>7010244807</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
