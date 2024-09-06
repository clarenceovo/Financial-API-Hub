var db= require('./dataConnector/sqlService.js');


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

    getCFTCInstrument:( async()=>{
        return await query(`SELECT instrument_id,instrument_name FROM fundamental_data.cftc_instrument`,[]);
         
    }),

    getCFTCInstrumentRecordById:( async(instrumentId)=>{
        return await query(`SELECT * FROM fundamental_data.cftc_instrument_record as a
                            join cftc_instrument b
                            on a.instrument_id = b.instrument_id
                            where a.instrument_id = ?;`
                            ,[instrumentId]);
         
    }),

}
