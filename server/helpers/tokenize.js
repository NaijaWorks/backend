const jwt = require('jsonwebtoken');
const secret = require('../config/secrets');

module.exports = {
   generateToken: function (user) {
      const payload = {
         subject: user.id,
         role: user.role,
         location: user.location,
      };
      const options = {
         expiresIn: '30d'
      };
      return jwt.sign(payload, secret.jwtSecret, options)
   }
}