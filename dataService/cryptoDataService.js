var db= require('./dataConnector/sqlService.js');

async function query(query,paramList){
    let param = paramList ?? []
    return new Promise((resolve,reject)=>{
        console.log('Retrieving Data from Database...');
        db.query(query,param,(err,data)=>{
            if(err){
                throw err;
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

    getAvailableTicker:(async(exchange)=>{
    return await query(`select distinct(contract) from 
                        open_interest where exchange =? `
                        ,[exchange]);

    })
    //`select * from open_interest where exchange = ? and contract =? order by datetime desc limit 10 `

}
