import React from "react";

import UserListItem from "./UserListItem";
import "./UserList.css";
import Card from "../../shared/components/UIElements/Card";

const UserList = (props) => {
  if (props.users.length === 0) {
    return (
      <Card>
        <h2>No users found</h2>
      </Card>
    );
  } else {
    return (
      <ul className="users-list">
        {props.users.map((user) => (
          <UserListItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        ))}
      </ul>
    );
  }
};

export default UserList;
