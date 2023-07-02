import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.jsx';

const Card = (props) => {
  const cardData = props.cardData;
  const userData = useContext(CurrentUserContext);
  const isOwn = cardData.owner === userData._id;
  const isLiked = cardData.likes.some((i) => i === userData._id);
  const cardLikeButtonClassName = `card__button-like ${
    isLiked && 'card__button-like_active'
  }`;

  function handleClick() {
    props.onCardClick(cardData);
  }
  function handleLikeClick() {
    props.onCardLike(cardData);
  }
  function handleDeleteClick() {
    props.onCardDelete(cardData);
  }

  return (
    <div className='card'>
      <img
        className='card__img'
        alt={cardData.name}
        src={cardData.link}
        onClick={handleClick}
      />

      {isOwn && (
        <button
          className='card__button-delete'
          type='button'
          aria-label='удалить'
          onClick={handleDeleteClick}
        />
      )}
      <div className='card__caption'>
        <h2 className='card__text'>{cardData.name}</h2>
        <div className='card__like-zone'>
          <button
            className={cardLikeButtonClassName}
            type='button'
            aria-label='нравится'
            onClick={handleLikeClick}
          />
          <span className='card__count-like'>{cardData.likes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
