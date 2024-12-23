var db= require('./dataConnector/sqlService.js');

async function query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.poolTradingData.query(query,param,(err,data)=>{
            if(err){
               reject(err);
            }
            //console.log(data)
            resolve(data);
            
        });

    });
}
async function crypto_query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.poolCryptoData.query(query,param,(err,data)=>{
            if(err){
               reject(err);
            }
            //console.log(data)
            resolve(data);
            
        });

    });
}

module.exports={

    get24HourOIData:(async(exchange , ticker )=>{
        return await query(`select datetime,exchange,contract,price,open_interest from open_interest where exchange = ? and contract =? and
                            datetime >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
                            order by datetime asc`
                            ,[exchange,ticker]);
         
    }),

    getAvailableOITicker:(async(exchange)=>{
    return await query(`select distinct(contract) from 
                        open_interest where exchange =? `
                        ,[exchange]);

    }),
    getCustomTimeRangeOpenInterest:(async(exchange,ticker,start,end)=>{
        return await query(`select datetime,exchange,contract,price,open_interest from open_interest 
                            where exchange = ? and contract =? and
                            datetime between ? AND  ?
                            order by datetime asc`
                            ,[exchange,ticker,start,end]);
    
        }),
    getAvailableFundingTicker:(async(exchange)=>{
        return await query(`select distinct(contract_code) from 
                            funding_rate where exchange =? `
                            ,[exchange]);

        }),
    getFundingRate:(async(exchange,ticker,start,end)=>{
        if (!(start&&end)){
            //START and END is not available , use default setting (14 days)
            end = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            start = new Date();
            start.setDate(start.getDate()-14);
            start = start.toISOString().replace(/T/, ' ').replace(/\..+/, '');

            }
        return await query(`select date,exchange,contract_code
                            ,funding_rate from funding_rate 
                            where exchange = ? and contract_code =? and
                            date between ? AND  ?
                            order by timestamp asc`
                            ,[exchange,ticker,start,end]);
    
        }),
    getHistData:(async(ticker,start,end)=>{
        const today = new Date();
        if (!start) {
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            start = oneYearAgo.toISOString().split('T')[0];
        }
        if (!end) {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            end = tomorrow.toISOString().split('T')[0];
        }
    
        const query = `
        SELECT date, open, high, low, close, volume, volume_usd 
        FROM crypto_data.crypto_ticker a
        LEFT JOIN crypto_data.ticker_table b ON a.tickerId = b.Id
        WHERE ticker = ? AND series_type = 7 AND type = 7
        AND date BETWEEN ? AND ?
        ORDER BY date ASC;`;

        return await crypto_query(query, [ticker, start, end]);




    })

}
