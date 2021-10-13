const db = require('../utils/db');

module.exports = {
  all() {
    return db('customer');
  },

  async single(id) {
    const customers = await db('customer')
      .where('customer_id', id);

    if (customers.length === 0) {
      return null;
    }

    return customers[0];
  },

  add(customer) {
    return db('customer').insert(customer);
  },

  del(id) {
    return db('customer')
      .where('customer_id', id)
      .del();
  },
  update(customer) {
    return db('customer').update(customer);
  },
};