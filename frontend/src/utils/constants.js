export const apiConfig = {
  link: 'https://api.mesto.sasha.nomoreparties.sbs',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
}