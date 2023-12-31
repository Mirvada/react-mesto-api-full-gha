const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res, req, next) => {
  next(new Unauthorized('Ошибка аутентификации токена'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, req, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'super-strong-key');
  } catch (err) {
    return handleAuthError(res, req, next);
  }

  req.user = payload;

  next();
};
