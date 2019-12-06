const db = require('./dbConfig');

module.exports = {
  findUsers,
  addUser,
  login
};

function findUsers() {
  return db('users');
}

function addUser(body) {
  return db('users')
    .insert(body)
    .then(() => {
      return db('users');
    });
}

function login(user) {
  return db.first().table('users').where({
    user_name: user
  });
}
