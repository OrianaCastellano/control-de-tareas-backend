const mysql = require('mysql')
const config = require('../config/config')
const pool = mysql.createPool(config.db)


const db = (() => {

  const _query = (query, params, callback) => {
    pool.getConnection((err, connection) => {

      if (err) {
        console.log(err);
        connection.release()
        callback(null, err)
        throw err
      }

      connection.query(query, params, (err, rows) => {
        connection.release()
        
        if (!err)
          callback(rows)

        else
          callback(null, err)
      })

    })
  }

  const _asyncQuery = async(query,params)=>{
    return await new Promise((resolve,reject)=>{
      db.query(query,params,(result,err)=>{
        if(err){
          //console.log(err);
          reject(err)
        }
  
        resolve(result);
    })
  }).then(data =>{return data})};

  return {
    query: _query,
    asyncQuery: _asyncQuery
  }

})()


module.exports = db
