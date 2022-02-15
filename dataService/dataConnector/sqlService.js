var mysql = require('mysql');
var dbCredentialTradingData = require('../../credential/dbCredential.json')

var poolTradingData = mysql.createPool(dbCredentialTradingData['trading_data']);
var poolEquityData = mysql.createPool(dbCredentialTradingData['equity_data']);

poolTradingData.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Crypto Data Database connected successfully');
  connection.release();
});
poolEquityData.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Equity Data Database connected successfully');
  connection.release();
});

module.exports = {
  poolTradingData:poolTradingData,
  poolEquityData:poolEquityData
}