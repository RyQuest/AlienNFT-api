const { contentInfo } = require('../models/Content')
const { OpenSeacontentInfo } = require('../models/openSeaContent')
const sendResponse = require('../helper/responseSender');

const getContent = async function (id) {
    let content = await contentInfo.findOne({ _id : id })
    if(content){
        return content
    }
    else
    {
        return null;
    }
}
const getAllContent = async function (query,page,limit, sort) {
    console.log("queryyyyyyyyyyyyy", query)
    console.log("sort", sort)

    const startIndex = (page - 1) * limit
        const endIndex = page * limit
  
        const results = {}
  
        const total=await contentInfo.countDocuments().exec();
  
        results.total=total;
        if (endIndex<total) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
  
    if(query)
    {
      console.log("in query");
        try{
          let regex = new RegExp(query,'i');
            
          search_data = {$and: [ { $or: [{title:regex },{price:regex},{category:regex}]}] }
            
          //  return await contentInfo.find(search_data).sort( {_id:-1 } );
  
          let painting=await contentInfo.find(search_data) 
          .limit(limit)
          .skip(startIndex)
          .sort({
            price: 1
          })
          results.content=painting;
          return results;
        }catch(e){
            console.log(e);
        }
      
    }
    else
    {
      if(sort == "Newest"){
        console.log("Newest");
          let painting=await contentInfo.find() 
          .limit(limit)
          .skip(startIndex)
          .sort({
            _id: -1
          })
          results.content=painting;
          return results;
        
      }
      else if(sort == "Oldest"){
        console.log("Oldest");
          let painting=await contentInfo.find() 
          .limit(limit)
          .skip(startIndex)
          .sort({
            _id: 1
          })
          results.content=painting;
          return results;
        
      }
      else if(sort == "High"){
        console.log("price High");
          let painting=await contentInfo.find() 
          .limit(limit)
          .skip(startIndex)
          .sort({
            price: -1
          })
          results.content=painting;
          return results;
        
      }
      else{
          try{
            let painting=await contentInfo.find() 
            .limit(limit)
            .skip(startIndex)
            .sort({
              price: 1
            })
            results.content=painting;
            return results;
          }catch(e){
              console.log(e);
          }
      }
    } 
}

const search=async(data)=>{
  try{
        
     console.log("data", data)
     let regex = new RegExp(data,'i');
     
     search_data = {'status':'approved', $and: [ { $or: [{title:regex },{price:regex},{category:regex}]}] }
     console.log("search_data", search_data)
      return await contentInfo.find(search_data).sort( {_id:-1 } );
  
 }catch(e){console.log(e)}
}

const LimitedCollection=async(category)=>{
  let limit = 8;
  const results = {}

  try{
    let regex = new RegExp(category,'i');
      
    search_data = {'status':'approved', $and: [ { $or: [{category:regex}]}] }
      
    //  return await ContentInfo.find(search_data).sort( {_id:-1 } );

    let painting=await contentInfo.find(search_data) 
    .limit(limit)
    
    
    results.content=painting;
    return results;
   }catch(e){
      console.log(e);
  }

}


const findContentbyId=async(content_id)=>{
  try {
    let isUpdated=await contentInfo.findOne({_id : content_id});
    return isUpdated;
} catch (error) {
    console.log("error", error)
} 
}

const openSeadataSave = async function (obj) {
    const content = new OpenSeacontentInfo(obj);
    await content.save();
    return content;
}

const getOpenSeaContent = async function (obj) {
  const content = await OpenSeacontentInfo.findOne({token_id : obj})
  return content;
}

module.exports = {
    getContent,
    getAllContent,
    search,
    LimitedCollection,
    findContentbyId,
    openSeadataSave,
    getOpenSeaContent
}