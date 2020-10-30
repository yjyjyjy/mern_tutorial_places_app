import React from "react";
import UserList from "../components/UserList";

const Users = () => {
  const USERS = [
    {
      id:'u1', 
      name:'Junyu Yang', 
      image:"https://media-exp1.licdn.com/dms/image/C4D03AQHC4jSAxafMlQ/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=JMNbOx4A8ac4sr9_S1bOaCE4-vWvHD0c9mt27vHB81g", 
      placeCount: 3
    }
  ]
  return <UserList users={USERS} />;
};

export default Users;
