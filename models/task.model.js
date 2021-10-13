const db = require('../utils/db');

module.exports = {
  async getTasksByUserId(userId) {
    const tasks = await db('tasks')
      .where('user_id', userId);

      return tasks;
  },

  add(task) {
    return db('tasks').insert(task);
  },

  update(id, taskWithoutId){
    return db('tasks').where('id', id).update(taskWithoutId)
  }
};