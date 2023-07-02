import React, { useEffect, useState } from 'react';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import ImagePopup from './ImagePopup.jsx';
import Main from './Main.jsx';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.jsx';
import EditProfilePopup from './EditProfilePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup.jsx';
import AddPlacePopup from './AddPlacePopup.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import * as auth from '../utils/auth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      const jwt = localStorage.getItem('jwt');
      Promise.all([api.getUserInfo(jwt), api.getInitialCards(jwt)])
        .then(([user, cardList]) => {
          console.log(user);
          setCurrentUser(user.data);
          setCards(cardList.data.reverse());
        })
        .catch((err) => console.log(`ошибка: ${err}`));
    }
  }, [loggedIn]);

  useEffect(() => {
    checkToken();
  }, []);

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isImgPopupOpen;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpen]);

  function handleCardClick(cardData) {
    setSelectedCard(cardData);
    setIsImgPopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleInfoTooltip() {
    setIsInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImgPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleCardLike(cardData) {
    const isLiked = cardData.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(cardData._id, isLiked)
      .then((likedCard) => {
        setCards((prevCards) =>
          prevCards.map((currentCard) =>
            currentCard._id === cardData._id ? likedCard.data : currentCard
          )
        );
      })
      .catch((err) => console.log(`ошибка: ${err}`));
  }

  function handleCardDelete(cardData) {
    api
      .deleteCard(cardData._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== cardData._id));
      })
      .catch((err) => console.log(`ошибка: ${err}`));
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api
      .sendEditedUserData(user)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => console.log(`ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .updateAvatar({ avatar })
      .then((res) => {
        setCurrentUser((prev) => ({ ...prev, avatar: res.data.avatar }));
        closeAllPopups();
      })
      .catch((err) => console.log(`ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleRegister({ password, email }) {
    auth
      .register({ password, email })
      .then(() => {
        setError(false);
        navigate('/signin');
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        handleInfoTooltip();
      });
  }

  function handleLogin({ password, email }) {
    auth
      .authorization({ password, email })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          setUserEmail(email);
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        setError(true);
        handleInfoTooltip();
      });
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setCurrentUser({});
    setUserEmail('');
    navigate('/signin', { replace: true });
  }

  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((user) => {
          setUserEmail(user.data.email);
          setLoggedIn(true);
          navigate('/', { replace: true });
        })
        .catch(() => {
          setError(true);
          handleInfoTooltip();
        });
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        loggedIn={loggedIn}
        userEmail={userEmail}
        onSignOut={handleLogout}
      />
      <Routes>
        <Route path='/signin' element={<Login onLogin={handleLogin} />} />
        <Route
          path='/signup'
          element={<Register onRegister={handleRegister} />}
        />
        <Route
          path='/'
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          }
        />
      </Routes>

      {loggedIn && <Footer />}

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <ImagePopup
        card={selectedCard}
        isOpen={isImgPopupOpen}
        onClose={closeAllPopups}
      />

      <InfoTooltip
        onClose={closeAllPopups}
        isOpen={isInfoTooltipPopupOpen}
        isError={isError}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
