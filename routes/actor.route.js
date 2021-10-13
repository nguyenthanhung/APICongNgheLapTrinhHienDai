const express = require('express');
const actorModel = require('../models/actor.model');
const actor_schema = require('../schemas/actor.json');
const validateJson = require('../middlewares/validate.mdw')

const { compile } = require('morgan');
const router = express.Router();

router.get('/', async function (req, res) {
  console.log(req.accessTokenPayload);
  const list = await actorModel.all();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const actor = await actorModel.single(id);
  if (actor === null) {
    return res.status(204).end();
  }

  res.json(actor);
})

router.post('/', validateJson(actor_schema), async function (req, res) {
  const actor = req.body;
  var id_list = await actorModel.add(actor);
  actor.actor_id = id_list[0];
  res.status(201).json(actor);
})

router.patch('/', validateJson(actor_schema), async function (req, res) {
  const actor = req.body;
  const actor_id = actor.actor_id;
  delete actor.actor_id;
  id_list = await actorModel.update(actor_id, actor);
  // actor.actor_id = id_list[0];
  res.status(201).json(actor);
})

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  if (id === 0) {
    return res.status(304).end();
  }

  await actorModel.del(id);
  res.json({
    message: 'OK'
  })
})

module.exports = router;