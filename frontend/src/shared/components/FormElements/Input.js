import React, { useReducer, useEffect } from "react";

import "./Input.css";
import { validate } from "../util/validators";

const ACTIONS = {
  CHANGE: "change",
  TOUCH: "touch",
};

const inputReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE:
      return {
        ...state,
        value: action.payload.value,
        isValid: validate(action.payload.value, action.validators),
      };
    case ACTIONS.TOUCH:
      return {
        ...state,
        isTouched: true
      }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid || false,
    isTouched: false
  });

  const {id, onInput} = props;
  const {value, isValid} = inputState

  useEffect(() => {
    props.onInput(id, value, isValid)
  }, [id, value, isValid, onInput]) // 不懂：why id and onInput should be the dependencies? 

  const changeHandler = (event) => {
    dispatch({
      type: ACTIONS.CHANGE,
      payload: { value: event.target.value },
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: ACTIONS.TOUCH });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
