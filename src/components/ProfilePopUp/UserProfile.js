// UserProfile.js
import React from "react";

const UserProfile = ({ user }) => (
  <div>
    <h1>User Profile</h1>
    <p>Name: {user.name}</p>
    <p>Email: {user.email}</p>
  </div>
);

export default UserProfile;
