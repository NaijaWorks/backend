const jwt = require('jsonwebtoken');
const secret = require('../config/secrets');

const User = require('../models/user');

module.exports = {
   generateToken: function (user) {
      const payload = {
         subject: user.id
      };
      const options = {
         expiresIn: '30d'
      };
      return jwt.sign(payload, secret.jwtSecret, options)
   },
   restrict: async function (token) {
      try {
         const decodedToken = await jwt.verify(token, secret.jwtSecret);
         const user = await User.findById(decodedToken.subject).exec();
         return user;
      } catch (error) {
         return null;
      }
   }
}