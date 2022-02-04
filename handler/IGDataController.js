const IGDataService = require('../dataService/IGDataService');
const responseParser = require('./response/standardResponse');
module.exports={

    getHKMarket:async(req,res)=>{
        await IGDataService.getHKMarketPrice();
        //let data = await IGDataService.getHKMarketPrice();
        return res.json([]);
        
        
    },
}