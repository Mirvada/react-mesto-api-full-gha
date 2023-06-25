import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = (props) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlace({
      name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      name="popup_add"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.isLoading? 'Сохранение...' : 'Сохранить'}
    >
      <input
        id="title-input"
        className="popup__input popup__input_type_title"
        type="text"
        value={name ?? ""}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название"
        name="title"
        minLength="2"
        maxLength="30"
        required
      />
      <span className="popup__error title-input-error" />
      <input
        id="link-input"
        className="popup__input popup__input_type_link"
        type="url"
        value={link ?? ""}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Ссылка на картинку"
        name="link"
        required
      />
      <span className="popup__error link-input-error" />
    </PopupWithForm>
  );
};

export default AddPlacePopup;
