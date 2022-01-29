const cryptoDataService = require('../dataService/cryptoDataService');
const responseParser = require('./response/standardResponse');
module.exports={


     get24HourOpenInterest:async(req,res)=>{
         let exchange = req.query.exchange ?? null;
         let ticker = req.query.ticker ?? null;
         if (ticker&&exchange){
            let data = await cryptoDataService.get24HourOIData(exchange , ticker);
            if(Array.isArray(data)){
               data.forEach((quote)=>{
                  if(quote['price']&&quote['open_interest']) {
                     quote['usdNotion'] =  Math.round(quote['price']*quote['open_interest']);
                  } else {
                     quote['usdNotion'] = null
                  }
                  
               })
               res.json(responseParser.res(data));

            }
            
         } else {   
            res.json(responseParser.voidParam());
         }
            
         
     },


     getAvailableTicker:async(req,res)=>{
      let exchange = req.query.exchange ?? null;

      if (exchange){
         let data = await cryptoDataService.getAvailableTicker(exchange);
         let ret = {
            contract:[]
         }
         if(Array.isArray(data)){
            data.forEach((data)=>{
               ret['contract'].push(data['contract'])
            });
            res.json(responseParser.res(ret));
         }
         res.json([]);
      } else {   
         res.json(responseParser.voidParam());
      }
        
    },


    customTimeRangeOpenInterest:async(req,res)=>{
        let ticker = req.query.ticker ?? null;
        let from = req.query.start ??null;
        let end = req.query.end ?? null;
        if (ticker && from && end){
           res.json(req.query.ticker);
        } else {   
           res.json('No ticker');
        }
           
        
    }

     
}