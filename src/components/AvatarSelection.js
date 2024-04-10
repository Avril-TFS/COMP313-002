import React, { useState, useEffect } from "react";

export const avatar1 = require("../assets/avatar1.png");
export const avatar2 = require("../assets/avatar2.png");
export const avatar3 = require("../assets/avatar3.png");
export const avatar4 = require("../assets/avatar4.png");
export const avatar5 = require("../assets/avatar5.png");
export const avatar6 = require("../assets/avatar6.png");
export const avatar7 = require("../assets/avatar7.png");
export const avatar8 = require("../assets/avatar8.png");
export const avatar9 = require("../assets/avatar9.png");

const AvatarSelection = (props) => {
    const { editMode } = props;
  // State to hold the selected avatar
  const [selectedAvatar, setSelectedAvatar] = useState(null);
console.log('editmode',editMode)
console.log('selectedAvatar',selectedAvatar)
  useEffect(() => {
    // Load avatar selection from local storage when component mounts
    const savedAvatar = localStorage.getItem("selectedAvatar");
    console.log('savedAvatar from useEffect',savedAvatar)
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);


  useEffect(() => {
  
   if (editMode) {
    handleAvatarSelect(selectedAvatar);
  }
  }, [editMode]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  
      localStorage.setItem("selectedAvatar", avatar);
   
  };

  
 // Render the saved avatar if it exists, otherwise render the list of avatars
 return (
    <div>
    
      {selectedAvatar ? (
        <img
          src={selectedAvatar}
          alt="Selected Avatar"
          className="selected-avatar"
        />
      ) : (
        <div className="avatar-list">
          {[avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9].map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={avatar === selectedAvatar ? "selected" : ""}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSelection;
