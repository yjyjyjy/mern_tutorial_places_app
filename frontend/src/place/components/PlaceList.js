import React from "react";

import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
  if (props.places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Create one?</h2>
          <Button to='/places/new'>add a place</Button>
        </Card>
      </div>
    );
  } else {
    return (
      <ul className="place-list">
        {props.places.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.imageUrl}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onPlaceDeleteHandler={props.onPlaceDeleteHandler}
          />
        ))}
      </ul>
    );
  }
};

export default PlaceList;
