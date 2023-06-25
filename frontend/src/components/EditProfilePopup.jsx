import React, { useContext, useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";

const EditProfilePopup = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.isLoading? 'Сохранение...' : 'Сохранить'}
    >
      <input
        id="edit-input"
        className="popup__input popup__input_type_name"
        type="text"
        value={name ?? ""}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
        name="name"
        minLength="2"
        maxLength="40"
        required
      />
      <span className="popup__error edit-input-error"></span>
      <input
        id="info-input"
        className="popup__input popup__input_type_info"
        type="text"
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="О себе"
        name="info"
        minLength="2"
        maxLength="200"
        required
      />
      <span className="popup__error info-input-error"></span>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
