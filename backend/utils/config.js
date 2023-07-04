const MONGO_DB = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/mestodb';
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-strong-key';

module.exports = {
  MONGO_DB,
  PORT,
  JWT_SECRET,
};
