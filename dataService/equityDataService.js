var db= require('./dataConnector/sqlService.js');


async function query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.poolEquityData.query(query,param,(err,data)=>{
            if(err){
                reject(err)
            }
            //console.log(data)
            resolve(data);
            
        });

        


    });
}


module.exports={

    getHKTickerShortSelling:(async(ticker , session,start , end )=>{
        var query_str = null;
        var param = null;
        if (start && end){
            query_str = `SELECT date,shares,turnover FROM 
            equity_data.short_selling WHERE ticker = ? and session = ?
            AND date between ? and ?
            order by date asc;`
            param = [ticker,session,start,end]

        } else{
            query_str = `SELECT date,shares,turnover FROM 
            equity_data.short_selling WHERE ticker = ? and session = ?
            order by date asc;`
            param = [ticker,session,start,end]
        }
        if(query_str&&param)
        return await query(query_str
                            ,param);
         
    }),

    getHKMorningShortSelling:(async()=>{
        return await query(`SELECT date as TRADING_DAY, sum(turnover) as DAILY_SHORT_SELLING_VOL 
                            FROM equity_data.short_selling
                            where session = 'AM'
                            GROUP BY date`
                            ,[]);
         
    }),
    getHKTotalShortSelling:(async()=>{
        return await query(`SELECT date as TRADING_DAY, sum(turnover) as DAILY_SHORT_SELLING_VOL 
                            FROM equity_data.short_selling
                            where session = 'PM'
                            GROUP BY date`
                            ,[]);
         
    }),

}