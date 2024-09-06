var mysql = require('mysql');
var dbCredentialTradingData = require('../../credential/dbCredential.json')

var poolTradingData = mysql.createPool(dbCredentialTradingData['trading_data']);
var poolEquityData = mysql.createPool(dbCredentialTradingData['equity_data']);
var poolCryptoData = mysql.createPool(dbCredentialTradingData['crypto_data']);
var poolFundamentalData = mysql.createPool(dbCredentialTradingData['fundamental_data']);
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
poolCryptoData.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Crypto Data Database connected successfully');
  connection.release();
});
poolFundamentalData.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Crypto Data Database connected successfully');
  connection.release();
});
module.exports = {
  poolTradingData:poolTradingData,
  poolEquityData:poolEquityData,
  poolCryptoData:poolCryptoData,
  poolFundamentalData:poolFundamentalData
}