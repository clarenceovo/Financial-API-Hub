var db= require('./dataConnector/sqlService.js');

let cftcInstrumentCache = null;
let cacheTimestampTopic = null;
const CACHE_DURATION_TOPIC = 60 * 60 * 1000; // Cache duration in milliseconds (5 minutes)

async function query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.poolFundamentalData.query(query,param,(err,data)=>{
            if(err){
                reject(err)
            }
            //console.log(data)
            resolve(data);
            
        });
    

    });
}

module.exports={

    getCFTCInstrument: async () => {
        // Check if the cache is valid
        const now = Date.now();
        if (cftcInstrumentCache && (now - cacheTimestampTopic) < CACHE_DURATION_TOPIC) {
            console.log('Returning cached data...');
            return cftcInstrumentCache;
        }

        // If cache is not valid or expired, query the database
        const data = await query(`SELECT instrument_id, instrument_name FROM fundamental_data.cftc_instrument`, []);

        // Update the cache
        cftcInstrumentCache = data;
        cacheTimestampTopic = now;

        return data;
    },


    getCFTCInstrumentRecordById:( async(instrumentId)=>{
        return await query(`SELECT * FROM fundamental_data.cftc_instrument_record as a
                            join cftc_instrument b
                            on a.instrument_id = b.instrument_id
                            where a.instrument_id = ?;`
                            ,[instrumentId]);
         
    }),

}
