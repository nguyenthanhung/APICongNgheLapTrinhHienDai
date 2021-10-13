
//token validation
const jwt = require("jsonwebtoken");

//validate middleware
module.exports = function auth(req, res, next){
  //kiem tra co gui access token hay khong
  //access token co hop le hay khong (het han, khong xac nhan duoc)
  const accessToken = req.headers['x-access-token'];
  if(!accessToken){
    return res.status(401).json({
      message: 'Access token not found'
    });
  }

  try {
    const decoded = jwt.verify(accessToken, 'privateKey');
    req.accessTokenPayload = decoded;
    next();
  } catch(err) {
    console.log(err);
    return res.status(401).json({
      message: 'Access token not valid'
    })
  }
}


