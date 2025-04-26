//const user = require("../models/User");

const roleMiddleware = (...alowedRoles)=>{
    return (req,res,next)=>{
  if(!req.user ||!req.user.role){
    return res.status(403).json({error:'Access Denied: No role provided'});
  }
  if(!alowedRoles.includes(req.user.role)){
    return res.status(403).json({ message: 'Access Denied: You do not have the required role' });
  }
  next();
};
};

module.exports=roleMiddleware;