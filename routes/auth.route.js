const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const schema = require('../schemas/login.json');
const refreshToken_schema = require('../schemas/refreshToken.json');
const validateJson = require('../middlewares/validate.mdw')
const randomstring = require('randomstring');
const { compile } = require('morgan');
const bcrypt = require('bcryptjs/dist/bcrypt');
const router = express.Router();

router.post('/', validateJson(schema), async function (req, res) {
  const userName = req.body.username;
  const password = req.body.password;

  const user  = await userModel.findByUserName(userName);
  
  if(user === null){
    return res.json({
      "authenticated" : false
    })
  }

  if(bcryptjs.compareSync(password, user.password) === false){
    return res.json({
      "authenticated" : false
    })
  }

  //login thanh cong
  //tao token

  //payload chua du lieu muon gui xuong client
  //vidu nhu du lieu dinh danh, quyen han
  const payload = {
    userId : user.id, // du lieu dinh danh
    //quyen han ....
  };

  const opts = {
    expiresIn: 10 * 60,
  };
  
  var accessToken = jwt.sign(payload, 'privateKey', opts);

  const refreshToken = randomstring.generate({
    length: 80,
    charset: 'alphabetic'
  });

  //save refresh token to DB
  await userModel.update(user.id, {
    rfToken: refreshToken
  });
  
  return res.json({
    "authenticated": true,
    accessToken,
    refreshToken,
    userName: user.name
  })
})


//refresh token
router.post('/refresh', validateJson(refreshToken_schema), async function (req, res){
  const { accessToken, refreshToken } = req.body;

  try {
    const decoded = jwt.verify(accessToken, 'privateKey', { 
      ignoreExpiration: true 
    });

    const { userId } = decoded;
    
    const isValid = await userModel.isValidRefreshToken(userId, refreshToken);

    if (isValid === true) {

      //payload chua du lieu muon gui xuong client
      //vidu nhu du lieu dinh danh, quyen han
      const payload = {
        userId: userId, // du lieu dinh danh
        //quyen han ....
      };

      const opts = {
        expiresIn: 10 * 60,
      };

      var newAccessToken = jwt.sign(payload, 'privateKey', opts);

      return res.json({
        accessToken: newAccessToken
      })
    }
    else{
      res.status(401).json({
        message: 'Refresh token is not valid.'
      })
    }
  } catch(err) {
    console.log(err);
    return res.status(401).json({
      message: 'Access token not valid'
    })
  }
})
module.exports = router;