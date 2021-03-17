'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config/jwt')

class AuthMiddleware {
  
  constructor(){

  }

  ensureUser = (req, res, next) => {

    if(!req.headers.authorization)
      return res.status(403).send(
        {
          "error" : ["Usuario no autorizado"]
        }
      )
  
    let token = req.headers.authorization.replace(/['"]+/g, ''),
        payload;
  
    try {
      token = token.replace('Bearer ','');
      payload = jwt.decode(token, config.secret)
    }catch(err) {
      return res.status(403).send({
        "error" : ["Usuario no autorizado"]
      })
    }
  
    req.user = payload
    next()
  }


}

module.exports = new AuthMiddleware();
