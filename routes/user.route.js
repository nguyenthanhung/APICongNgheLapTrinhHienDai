const express = require('express');
const bcryptjs = require('bcryptjs');
const userModel = require('../models/user.model');
const user_schema = require('../schemas/user.json');
const validateJson = require('../middlewares/validate.mdw')

const { compile } = require('morgan');
const router = express.Router();

router.post('/', validateJson(user_schema), async function (req, res) {
  const user = req.body;
  user.password = bcryptjs.hashSync(user.password, 3);
  var id_list = await userModel.add(user);
  user.id = id_list[0];
  delete user.password;
  res.status(201).json(user);
})

module.exports = router;