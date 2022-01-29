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

router.get('/crypto/getAvailableTicker',cryptoDataController.getAvailableTicker);

router.get('/crypto/openInterestD1',cryptoDataController.get24HourOpenInterest);


module.exports = router;