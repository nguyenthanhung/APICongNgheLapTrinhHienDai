const express = require('express');
const taskModel = require('../models/task.model');
const task_schema = require('../schemas/task.json');
const validateJson = require('../middlewares/validate.mdw')

const { compile } = require('morgan');
const router = express.Router();

router.get('/', async function (req, res) {
  const userId = req.accessTokenPayload.userId;
  console.log(userId);
  const listTasks = await taskModel.getTasksByUserId(userId);
  if (listTasks === null) {
    return res.status(204).end();
  }

  res.json(listTasks);
})

router.post('/', validateJson(task_schema), async function (req, res) {
  const task = req.body;
  console.log(task);
  var id_list = await taskModel.add(task);
  task.id = id_list[0];
  res.status(201).json(task);
})

router.patch('/', validateJson(task_schema), async function (req, res) {
  const task = req.body;
  const id = task.id;
  delete task.id;
  id_list = await taskModel.update(id, task);
  // actor.actor_id = id_list[0];
  res.status(201).json(task);
})

module.exports = router;