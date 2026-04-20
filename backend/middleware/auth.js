const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const tokenHeader = req.header('Authorization');
  
  if (!tokenHeader) {
    return res.status(401).json({ message: "Access Denied! Bhai token kahan hai?" });
  }

  try {
    const token = tokenHeader.split(" ")[1]; 
    const verified = jwt.verify(token, process.env.JWT_SECRET || "arsalan_youtube_clone_secret_key");
    
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ message: "Invalid Token! Tera ticket nakli hai." });
  }
};

module.exports = verifyToken;