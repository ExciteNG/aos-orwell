const jwt= require('jwt-decode')


const verifyCookie=async (req,res,next)=>{
  const token = req.headers.cookie;
  if(!token) res.status(401);
  const decodedToken = jwt(token);
  if(!decodedToken) return res.status(401);
  req.user = decodedToken.userType;
  req.profile = decodedToken.email
  next();

}


module.exports = {
  verifyCookie
}
