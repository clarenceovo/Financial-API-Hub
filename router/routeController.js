var express = require('express');
var router = express.Router();
const cryptoDataController = require('../handler/cryptoDataController')
router.use(function middleWare(req, res, next) {
   /* Log the Timestamp and IP  */
   /* TODO: Add AUTH validation */
   console.log('Host of Caller:'+JSON.stringify(req.headers.host));
   console.log('Time: ', Date.now());
   next();
 });

//Crypto

//Open Interest
router.get('/crypto/getAvailableOITicker',cryptoDataController.getAvailableOITicker);
router.get('/crypto/openInterestD1',cryptoDataController.get24HourOpenInterest);
router.get('/crypto/customTimeRangeOpenInterest',cryptoDataController.customTimeRangeOpenInterest);
router.get('/crypto/getAvailableFundingTicker',cryptoDataController.getAvailableFundingTicker);
router.get('/crypto/getFundingRate',cryptoDataController.getFundingRate);

//Funding


//FX

//Credit

//Fundamental

//HK Stock

//US Stock

module.exports = router;