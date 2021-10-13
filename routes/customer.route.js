const express = require('express');

const customerModel = require('../models/customer.model');
const customer_schema = require('../schemas/customer.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await customerModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const customer = await customerModel.single(id);
  if (customer === null) {
    return res.status(204).end();
  }

  res.json(customer);
})

router.post('/', async function (req, res) {
  const customer = req.body;
  const id = req.params.id || 0;
  const customer_db = await customerModel.single(id);
  const id_list = null;
  if (customer_db === null) {
    id_list = await customerModel.add(customer);
  }else{
    id_list = await customerModel.update(customer);
  }
  customer.customer_id = id_list[0];
  res.status(201).json(customer);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  if (id === 0) {
    return res.status(304).end();
  }

  await customerModel.del(id);
  res.json({
    message: 'OK'
  })
})

module.exports = router;