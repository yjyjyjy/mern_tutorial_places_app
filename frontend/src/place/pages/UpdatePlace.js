import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/components/util/validators";
import Button from "../../shared/components/FormElements/Button";

import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hooks";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const [isLoading, error, sendRequest, clearError] = useHttpClient();
  const [placeToBeUpdated, setPlaceToBeUpdated] = useState();
  const auth = useContext(AuthContext)
  const placeId = useParams().placeId;
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );
  const history = useHistory();

  const fetchPlaceToBeUpdated = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`
      );
      setPlaceToBeUpdated(responseData.place);
      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (err) {}
  };

  useEffect(() => {
    fetchPlaceToBeUpdated();
  }, [sendRequest, placeId, setFormData]);

  const sendPlaceUpdateAPICall = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          AuthToken: auth.authToken,
        }
      );
      history.push(`/${auth.currentUserId}/places`);
    } catch {}
  };

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    sendPlaceUpdateAPICall();
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!placeToBeUpdated && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No address found</h2>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={placeToBeUpdated.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={placeToBeUpdated.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </Fragment>
  );
};

export default UpdatePlace;
