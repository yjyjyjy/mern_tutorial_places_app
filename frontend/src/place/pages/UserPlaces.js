import React, { Fragment, useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [isLoading, error, sendRequest, clearError] = useHttpClient();
  const [userPlaces, setUserPlaces] = useState([]);

  const userId = useParams().userId;

  const fetchPlaces = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/user/${userId}`
      );
      setUserPlaces(responseData.places);
    } catch (err) {}
  };

  useEffect(() => {
    fetchPlaces();
  },[]);

  const onPlaceDeleteHandler = (deletedPlaceId) => {
    setUserPlaces(userPlaces.filter((place) => place.id !== deletedPlaceId));
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <PlaceList
        places={userPlaces}
        onPlaceDeleteHandler={onPlaceDeleteHandler}
      />
    </Fragment>
  );
};

export default UserPlaces;
