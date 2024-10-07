const jwt = require('jsonwebtoken');

const key = "Hello";

const fetchAdmin = (req, res, next) => {
    const token = req.header('auth-token');
  
  
    if (!token) {

        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const data = jwt.verify(token, key);
        req.user = data.id;  // Extract only the user ID from the token
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};





module.exports = fetchAdmin
