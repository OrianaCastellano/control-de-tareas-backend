'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config/config');


exports.createToken = (user) => {

  let payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(config.jwt.expirationDays, 'days').unix()
  }

  return jwt.encode(payload, config.jwt.secret)
}
