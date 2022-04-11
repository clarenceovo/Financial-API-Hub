var express = require('express');
const equityDataService = require('../dataService/equityDataService');
var router = express.Router();
const cryptoDataController = require('../handler/cryptoDataController');
const equityDataController = require('../handler/equityDataController');
const IGDataController = require('../handler/IGDataController');

router.use(function middleWare(req, res, next) {
   /* Log the Timestamp and IP  */
   /* TODO: Add AUTH validation */
   console.log('Host of Caller:'+JSON.stringify(req.headers.host));
   console.log('Time: ', Date.now());
   next();
 });

 
//Open Interest
router.get('/crypto/getAvailableOITicker',cryptoDataController.getAvailableOITicker);
router.get('/crypto/openInterestD1',cryptoDataController.get24HourOpenInterest);
router.get('/crypto/customTimeRangeOpenInterest',cryptoDataController.customTimeRangeOpenInterest);
router.get('/crypto/getAvailableFundingTicker',cryptoDataController.getAvailableFundingTicker);
router.get('/crypto/getFundingRate',cryptoDataController.getFundingRate);
router.get('/crypto/getHistData',cryptoDataController.getHistData);


//IG


//FX

//Credit

//Fundamental

//HK Stock
router.get('/equity/HK/getShortSellingByTicker',equityDataController.getShortSellingByTicker);
router.get('/equity/HK/getDailyMorningShortSelling',equityDataController.getDailyMorningShortSelling);
router.get('/equity/HK/getDailyTotalShortSelling',equityDataController.getDailyTotalShortSelling);
router.get('/equity/HK/getHSIFutureOI',equityDataController.getHSIFutureOI);
router.get('/equity/HK/getHSIStockOptionOI',equityDataController.getHSIStockOptionOI);



//US Stock

module.exports = router;