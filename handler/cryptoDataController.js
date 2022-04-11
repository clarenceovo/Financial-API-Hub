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
                  
               });
               return res.json(responseParser.res(data));

            }
            
         } else {   
            return res.json(responseParser.voidParam());
         }
            
         
     },

     getAvailableOITicker:async(req,res)=>{
      let exchange = req.query.exchange ?? null;

      if (exchange){
         let data = await cryptoDataService.getAvailableOITicker(exchange);
         let ret = {
            contract:[]
         }
         if(Array.isArray(data)){
            data.forEach((data)=>{
               ret['contract'].push(data['contract'])
            });
            return res.json(responseParser.res(ret));
         }
         return res.json([]);
      } else {   
         return res.json(responseParser.voidParam());
         }
        
      },

      customTimeRangeOpenInterest:async(req,res)=>{
         let exchange = req.query.exchange ?? null;
         let ticker = req.query.ticker ?? null;
         let start = req.query.start ??null;
         let end = req.query.end ?? null;
         if (exchange && ticker && start && end){
         let data = await cryptoDataService.getCustomTimeRangeOpenInterest(exchange , ticker,start,end);
         return res.json(responseParser.res(data));

         } else {   
            return res.json(responseParser.voidParam());
         }
      },

      getAvailableFundingTicker:async(req,res)=>{
         let exchange = req.query.exchange ?? null;
   
         if (exchange){
            let data = await cryptoDataService.getAvailableFundingTicker(exchange);
            let ret = {
               contract:[]
            }
            if(Array.isArray(data)){
               data.forEach((data)=>{
                  ret['contract'].push(data['contract_code'])
               });
               return res.json(responseParser.res(ret));
            }
            return res.json([]);
         } else {   
            return res.json(responseParser.voidParam());
            }
         },
      
      getFundingRate:async(req,res)=>{
         let exchange = req.query.exchange ?? null;
         let ticker = req.query.ticker ?? null;
         let start = req.query.start ?? null;
         let end = req.query.end ?? null;
         
         if (exchange){
            let data = await cryptoDataService.getFundingRate(exchange,ticker,start,end);
            
            
            return res.json(responseParser.res(data));
         } else {   
            return res.json(responseParser.voidParam());
            }
         },

      getHistData:async(req,res)=>{
         let exchange = req.query.exchange ?? null;
         let ticker = req.query.ticker ?? null;
         let start = req.query.start ?? null;
         let end = req.query.end ?? null;
         if (exchange && ticker && start && end){
            let data = await cryptoDataService.getHistData(exchange,ticker,start,end);
            return res.json(responseParser.res(data));
            
         }else{
            return res.json(responseParser.voidParam());
         }


      }
   
    

     
}