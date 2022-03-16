var cron = require('node-cron');
var express = require("express");
var router = express.Router();
const axios = require('axios');
const contentServices = require("../services/contentServices");

cron.schedule('* * * * *', async () => {
    check_reading();
    console.log('running task every minute');
    
});

async function check_reading(){
    console.log("in function");
    let order_direction = "desc";
    let offset = 0;
    let limit= 50;
  
    let api_url='https://testnets-api.opensea.io/api/v1/assets?owner='+ "0x6abeda041e15Ac5365465cF03B502F9E0048C283"+'&order_direction='+ order_direction +'&offset='+ offset +'&limit=' + limit;
  
    let nftData=await axios.get(api_url);
  
  
        nftData.data.assets.forEach( async(element,index)=>{
      // console.log("element", element);
        let obj = {
            permalink : element.permalink,
            name : element.name,
            description : element.description,
            image_url : element.image_url,
            image_url_thumbnail : element.image_thumbnail_url,
            image_url_preview : element.image_preview_url,
            token_id : element.token_id,
            status : "approved",
            date : element.collection.created_date,
            attributes : [ {trait_type : element.traits[0].trait_type, value : element.traits[0].value}, {trait_type : element.traits[1].trait_type, value : element.traits[1].value }, {trait_type : element.traits[2].trait_type, value : element.traits[2].value}, {trait_type : element.traits[3].trait_type, value : element.traits[3].value}]
          }
  
          let opencontent = await contentServices.getOpenSeaContent( element.token_id);
          if(opencontent){
            console.log("alredy");
  
          }else{
            let savedata = await contentServices.openSeadataSave(obj);
            console.log("savedata", savedata);
          }
          
          
      });
  }


module.exports = router;
