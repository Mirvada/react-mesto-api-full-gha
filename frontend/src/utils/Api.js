import { apiConfig } from "./constants.js";

class Api {
  constructor(apiConfig) {
    this._link = apiConfig.link;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo(jwt) {
    return fetch(`${this._link}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => this._checkResponse(res))
  }

  sendEditedUserData(data, jwt) {
    return fetch(`${this._link}/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(res => this._checkResponse(res))
  }

  updateAvatar({ avatar }, jwt) {
    return fetch(`${this._link}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar })
    })
      .then(res => this._checkResponse(res))
  }

  getInitialCards(jwt) {
    return fetch(`${this._link}/cards`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => this._checkResponse(res))
  }

  addCard(card, jwt) {
    return fetch(`${this._link}/cards`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: card.name,
        link: card.link
      })
    })
      .then(res => this._checkResponse(res))
  }

  getLikes(jwt) {
    return fetch(`${this._link}/cards`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    })
      .then(res => this._checkResponse(res))
  }

  changeLikeCardStatus(cardId, isLiked, jwt) {
    if (isLiked) {
      return fetch(`${this._link}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      })
        .then(res => this._checkResponse(res))
    }
    else {
      return fetch(`${this._link}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      })
        .then(res => this._checkResponse(res))
    }
  }

  deleteCard(cardId, jwt) {
    return fetch(`${this._link}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    })
      .then(res => this._checkResponse(res))
  }
}

export const api = new Api(apiConfig);