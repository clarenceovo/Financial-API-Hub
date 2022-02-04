var igAPI= require('./dataConnector/igService');


module.exports={
    getHKMarketPrice:(async()=>{
        //igAPI.query("121029");
        console.log('Getting HK Price');
        var conn = new igAPI();
        conn.getMarketData("121029");
    })


}