const responseParser = require('./response/standardResponse');
const fundamentalDataService = require('../dataService/fundamentalDataService');

module.exports={

    getCFTCInstrument:async(req,res)=>{
        let data = await fundamentalDataService.getCFTCInstrument();
        return res.json(responseParser.res(data));

    },

    getCFTCInstrumentRecordById:async(req,res)=>{
        let instrumentId = req.query.instrumentId ?? null;
        if (instrumentId == null){
            return res.json(responseParser.voidParam());
        }
        let data = await fundamentalDataService.getCFTCInstrumentRecordById(instrumentId);
        return res.json(responseParser.res(data));


    }

}