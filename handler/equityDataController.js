const equityDataService = require('../dataService/equityDataService');
const responseParser = require('./response/standardResponse');

module.exports={
    getShortSellingByTicker:async(req,res)=>{
        let ticker = req.query.ticker ?? null;
        let session = req.query.session ?? null;
        let start = req.query.start ?? null;
        let end = req.query.end ?? null;
        if (ticker){
            console.log("Ticker:"+ticker);
            let data = await equityDataService.getHKTickerShortSelling(ticker,session,start,end);
            return res.json(responseParser.res(data));
        }else{
            return res.json(responseParser.voidParam());
        }
    },
    getDailyMorningShortSelling:async(req,res)=>{
        let data = await equityDataService.getHKMorningShortSelling();
        return res.json(responseParser.res(data));

    },
    getDailyTotalShortSelling:async(req,res)=>{
        let data = await equityDataService.getHKTotalShortSelling();
        return res.json(responseParser.res(data));
    },
    getHSIFutureOI:async(req,res)=>{
        let data = await equityDataService.getHSIFutureOI();
        return res.json(responseParser.res(data));
    },

    getHSIStockOptionOI:async(req,res)=>{
        let ticker =req.query.ticker ?? null;
        let strike =req.query.strike ?? null;
        let type =req.query.type ?? null;
        let month=req.query.month ?? null;
        let start=req.query.start ?? null;
        let end=req.query.end ?? null;

        let data = await equityDataService.getHSIStockOptionOI(ticker,strike,type,month,start,end);
        if (data != null)
            return res.json(responseParser.res(data));
        else
            return res.json(responseParser.voidParam());
    },

    getHSIIndexOptionOI:async(req,res)=>{
        let strike =req.query.strike ?? null;
        let type =req.query.type ?? null;
        let month=req.query.month ?? null;
        let start=req.query.start ?? null;
        let end=req.query.end ?? null;

        let data = await equityDataService.getHSIIndexOptionOI(strike,type,month,start,end);
        if (data != null)
            return res.json(responseParser.res(data));
        else
            return res.json(responseParser.voidParam());
    },

    getPriceTicker:async(req,res)=>{
        let ticker =req.query.ticker ?? null;
        let startDate=req.query.startDate ?? null;
        let endDate=req.query.endDate ?? null;
        let data = await equityDataService.getStockHistData(ticker,startDate,endDate);
        return res.json(responseParser.res(data));
    },

    getTicker:async(req,res)=>{
        let tickerId =req.query.tickerId ?? null;
        let startDate=req.query.startDate ?? null;
        let endDate=req.query.endDate ?? null;
        if (tickerId){
            let data = await equityDataService.getStockTicker(tickerId,startDate,endDate);
            return res.json(responseParser.res(data));
        } else {
            return res.json(responseParser.voidParam());
        }

    },
    
    getTickerList:async(req,res)=>{
        let data = await equityDataService.getStockTickerList();
        return res.json(responseParser.res(data));
    },

    getPrice:async(req,res)=>{
        let symbol =req.query.symbol ?? null;
        if (symbol){
            let data = await equityDataService.getStockPriceByTicker(symbol);
            return res.json(responseParser.res(data));
        } else {
            return res.json(responseParser.voidParam());
        }
    }
}