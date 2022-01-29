var mysql = require('mysql');
var dbCredential = require('../../credential/dbCredential.json')

var pool = mysql.createPool(dbCredential);

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;