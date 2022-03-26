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
    getHSIFutureOI:(async()=>{
        return await query(`SELECT trading_date as date, current_price , 
                            current_volume as volume , open_interest 
                            FROM equity_data.future_oi_hsi`
                            ,[]);
         
    }),
    getHSIStockOptionOI:(async(ticker,strike,type,month,start,end)=>{
        try{
            var query_str = `SELECT record_date as date ,DATE_FORMAT(contract_month, '%Y-%m') AS contract_month,type,
                            strike,open , high ,low ,close ,
                            iv as implied_vol , open_interest , oi_change
                            FROM equity_data.stock_option_oi
                            WHERE stock_id = ? and  contract_month =?`;
            var param = [ticker,month];
            if(strike != null){
                query_str+=` AND strike = ? `;
                param.push(strike)
            }
            if(type != null && ['C','P'].includes(type)){
                console.log(type);
                query_str+=` AND type = ? `;
                param.push(type)
            }
            if(start != null && end != null){
                query_str+=` AND  record_date between ? and ?`;
                param.push(start);
                param.push(end);
            }
            console.log(query_str)
            return await query(query_str,param);
        }catch{
            return null;
        }
         
    }),

}