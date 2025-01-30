var db= require('./dataConnector/sqlService.js');
const redisClient= require('./dataConnector/redisService.js');
const { json } = require('express');


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

async function price_query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.poolTradingData.query(query,param,(err,data)=>{
            if(err){
                reject(err)
            }
            //console.log(data)
            resolve(data);            
        });

    });
}

async function redis_hget_query(key,field) {
    try {
        const value = await redisClient.hGet(key,field);
        return value;
    } catch (err) {
        console.error('Error querying Redis:', err);
        return null;
    }
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
            //console.log(query_str)
            return await query(query_str,param);
        }catch{
            return null;
        }
         
    }),

    getHSIIndexOptionOI:(async(strike,type,month,start,end)=>{
        try{
            var query_str = `SELECT record_date as date ,DATE_FORMAT(contract_month, '%Y-%m') AS contract_month,type,
                            strike,open , high ,low ,close ,
                            iv as implied_vol , open_interest ,volume, oi_change
                            FROM equity_data.index_option_oi
                            WHERE contract_month =?`;
            var param = [month];
            console.log(month);
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
            return await query(query_str,param);
        }catch{
            return null;
        }
         
    }),

    getStockHistData:(async(ticker,startDate,endDate)=>{
        try{
            var query_str = `SELECT index_ticker as name ,date as time,
                            open , high ,low ,close ,volume
                            FROM equity_data.price_ticker
                            WHERE index_ticker =? and DATE(date) between ? and ?;`;
            var param = [ticker,startDate,endDate];
            return await query(query_str,param);
        }catch{
            return null;
        }
         
    }),

    getStockTicker:(async(tickerId,startStr,endStr)=>{

        try{
            var query_str = `SELECT * 
                            FROM equity_data.price_ticker 
                            WHERE tickerId = ? 
                            AND date BETWEEN ? AND ?
                            ORDER BY date;`;
            var param = [tickerId,startStr,endStr];
            return await query(query_str,param);
        }catch{
            return null;
        }
    }),

    getStockTickerList:(async()=>{
        try{
            var query_str = `SELECT id, ticker , product_type 
                            FROM equity_data.ticker_table;`;
            return await query(query_str,[]);
        }catch{
            return null;
        }
    }),

    getStockPriceByTicker:(async(ticker,from_date)=>{
        try{
            var query_str = `SELECT datetime, open, high, low, close, vol_usd AS volume 
            FROM trading_data.price_ticker a 
            LEFT JOIN trading_data.ticker_table b ON a.ticker_id = b.ticker_id 
            WHERE b.ticker_symbol = ?  and datetime > ?;`;
            return await price_query(query_str,[ticker,from_date]);
        }catch{
            return null;
        }
    }),

    getCompanyInfo:(async(ticker)=>{

        try {
            const idx = [['US', 'DJI'], ['US', 'SP500'], ['US', 'NAS100'], ['JP', 'NIKKEI225'], ['HK', 'HSI']];
            for (let i = 0; i < idx.length; i++) {
                const key = `MktData:StaticData:${idx[i][0]}:${idx[i][1]}:Info`;
                console.log("Querying key:" + key);
                const data = await redis_hget_query(key, ticker);
                if (data != null) {
                    // data to JSON object
                    return JSON.parse(data);
                }
            }
            return null;
        } catch (error) {
            console.error('Error querying Redis:', error);
            return null;
        }
    }),


}