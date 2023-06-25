import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = (props) => {
  const inputRef = useRef();

  React.useEffect(() => {
    inputRef.current.value = "";
  }, [props.isOpen]);
  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="popup_add-avatar"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.isLoading? 'Сохранение...' : 'Сохранить'}
    >
      <input
        id="avatar-input"
        ref={inputRef}
        className="popup__input popup__input_type_link-avatar"
        type="url"
        placeholder="Ссылка на аватар"
        name="avatar"
        required
      />
      <span className="popup__error avatar-input-error"></span>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
