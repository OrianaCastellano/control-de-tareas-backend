'use strict'

const { createLogger, format, transports } = require('winston')


const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json(),
  ),
  transports: [
    new transports.File({
      level: 'error',
      maxsize: 5120000,
      maxFiles: 25,
      filename: `${ __dirname }/../../logs/error-tiendanegocio-backend.log`
    }),
    new transports.File({
      level: 'info',
      maxsize: 5120000,
      maxFiles: 15,
      filename: `${ __dirname }/../../logs/info-tiendanegocio-backend.log`
    }),
    new transports.File({
      level: 'debug',
      maxsize: 5120000,
      maxFiles: 15,
      filename: `${ __dirname }/../../logs/debug-tiendanegocio-backend.log`
    })
  ]
})


if(process.env.NODE_ENV !== 'production')
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `[${ info.timestamp }] ${ info.level } ${ info.message }`)
    ),
    level: 'debug'
  }))


module.exports = logger
