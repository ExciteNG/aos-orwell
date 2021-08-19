const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // console.log(req.headers.authorization.split(' ')[1])
  const token = req.body.token;
  // console.log(token);
  if (!token)
    return res.send({ msg: "Access denied", msgType: "error" }).status(401);

  try {
    // verify the token
    jwt.verify(
      token,
      process.env.PAY_TOKEN_SECRET,
      (err, payload) => {
          if(err) res.status(401).json({msg:"Expired token"})
        // if valid
        req.plan = payload;
    
        next();
      }
    );
  } catch {
   return res.status(400);
  }
};
