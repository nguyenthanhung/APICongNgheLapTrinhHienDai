const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
require('express-async-errors');

const auth = require('./middlewares/auth.mdw')
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
app.get('/', function (req, res) {
  res.json({
    message: 'Hello from Sakila backend!'
  });
});

app.use('/api/customers', require('./routes/customer.route'));
app.use('/api/actors', auth, require('./routes/actor.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/task', auth, require('./routes/task.route'));
 
app.get('/err', function (req, res) {
  throw new Error('Error!');
});

app.use(function (req, res, next) {
  res.status(404).send({
    error_message: 'Endpoint not found!'
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({
    error_message: 'Something broke!'
  });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, function () {
  console.log(`Sakila backend api is running at http://localhost:${PORT}`);
});