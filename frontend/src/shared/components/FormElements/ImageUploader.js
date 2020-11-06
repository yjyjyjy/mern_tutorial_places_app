import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUploader = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      // this runs when the file reading is done.
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const imagePickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false); // bad code. Awkward error handling.
      fileIsValid = false; // seriously bad code. There has to be a more elgent solution.
    }
    props.onInput(props.id, pickedFile, fileIsValid);

    // forward the file to the actual handler.
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }} // test this.
        type="file"
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={imagePickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUploader;
