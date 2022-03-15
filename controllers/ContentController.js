const path = require("path");
const contentServices = require("../services/contentServices");
// const sendResponse = require('../helper/responseSender');
require("dotenv").config();

const content = async function (req, res) {
  try {
    console.log("postmethod all content");
    let page = req.body.page;

    let limit = req.body.limit;
    let query = req.body.search_tag;
    let sort = req.body.sortBy;
    console.log(page);
    console.log("query", query);
    if (page == undefined || page == null || page == "") {
      page = 1;
      limit = 20;
      query = "";
    }
    page = parseInt(page);
    limit = parseInt(limit);

    let content = await contentServices.getAllContent(query, page, limit, sort);
    console.log("content", content);
    // validations
    if (content == null || content == undefined || content == "") {
      // return sendResponse(res, { status: false, message: "Content not found!" });
      res.send({ message: "Content not found!" });
    } else {
      // return sendResponse(res, { status: true, data:content,  message: "Content" });
      res.send({ data: content, message: "Content" });
    }
  } catch (error) {
    console.log("error", error);
    // return sendResponse(res, { status: false, message: "Something went wrong" });
    res.send({ message: "Something went wrong" });
  }
};

const contentdetail = async function (req, res) {
  try {
    console.log("postmethod contentdetail", req.body);

    let content = await contentServices.getContent(req.body.content_id);
    console.log("...", content);
    // validations
    if (content == null || content == undefined || content == "") {
      // return sendResponse(res, 400, { status: false, message: "Invalid content" });
      res.send({ message: "Invalid content" });
    } else if (content) {
      // let user = await Registration.findOne({ _id: content.user_id });
      // if(user == null || user == undefined || user == ""){

      //     // return sendResponse(res, 400, { status: false, message: "Invalid user" });
      //     res.send({message: "Invalid user"})
      // }

      // obj resonse
      let data = {
        content: content,
        // user_id : user._id,
        // user_name : user.name,
      };

      // return sendResponse(res, 200, { status: true, data :data,  message: "Content" });
      res.send({ data: data, message: "Content" });
    } else {
      // return sendResponse(res, 500, { status: false, message: "Something went wrong" });
      res.send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log("error", error);
    // return sendResponse(res, 500, { status: false, message: "Something went wrong" });
    res.send({ message: "Something went wrong" });
  }
};

const searchApi = async (req, res) => {
  let search_tag = req.body.search_tag;

  let content = await contentServices.search(search_tag);
  let contentArr = [];
  for (key of content) {
    let image_name = key.image;

    const data = {
      _id: key._id,
      name: key.name,
      image: image_name,
      category: key.category,
      description: key.description,
    };
    //contentArr.data=
    contentArr.push(data);
  }

  res.send(contentArr);
};

// const LimitedCollectionApi=async(req,res)=>{
//     let category=req.body.category_name;
//     if(category==undefined||category==null||category==""){
//       category="";
//      }

//     let content=await contentServices.LimitedCollection(category);

//     console.log(content)

//     console.log("ASSET_URL", ASSET_URL);

//     let contentArr={};

//     contentArr.data=[];

//     for(key of content.content){

//         let image_name=ASSET_URL+key.image;

//          const data={'_id':key._id,
//                          'name':key.name,
//                          'price':key.price,
//                          'image':image_name,
//                          'category':key.category,
//                          'description':key.description,
//                          'is_sold':key.sold,
//                          'status':key.status,
//                          }
//          //contentArr.data=
//          contentArr.data.push(data)

//        }

//      res.send(contentArr);

//   }

const categoryNft = async (req, res) => {
  let category = req.body.category_name;
  if (category == undefined || category == null || category == "") {
    category = "";
  }

  let artData = await contentServices.LimitedCollection("Art");
  let musicData = await contentServices.LimitedCollection("Music");
  let sportData = await contentServices.LimitedCollection("Sport");
  let utilitiesData = await contentServices.LimitedCollection("Utilities");

  console.log(content);

  console.log("ASSET_URL", ASSET_URL);

  let contentArr = {};

  contentArr.artData = artData;
  contentArr.musicData = musicData;
  contentArr.sportData = sportData;
  contentArr.utilitiesData = utilitiesData;

  res.send(contentArr);
};

module.exports = {
  content,
  contentdetail,
  searchApi,
  // LimitedCollectionApi,
  categoryNft,
};
