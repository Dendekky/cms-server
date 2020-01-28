import Users from '../models/user';

const addUser = user => Users.create(user);
const getUserByLogin = email => Users.findOne({ email });
const getAll = () => Users.find();
module.exports = {
  addUser,
  getUserByLogin,
  getAll,
};
