const db = require('../utils/db');

module.exports = {
  all() {
    return db('users');
  },

  async single(id) {
    const users = await db('users')
      .where('id', id);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async findByUserName(userName) {
    const users = await db('users')
      .where('username', userName);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  add(user) {
    return db('users').insert(user);
  },

  del(id) {
    return db('users')
      .where('id', id)
      .del();
  },

  update(user_id, userWithoutId){
    return db('users').where('id', user_id).update(userWithoutId)
  },

  async isValidRefreshToken(userId, refreshToken){
    const ret = await db('users').where('id', userId)
      .andWhere('rfToken', refreshToken);
    if(ret.length === 0){
      return false;
    }
    return true;
  }
};