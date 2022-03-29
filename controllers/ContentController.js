const path = require("path");
const axios = require('axios');
const multer = require("multer");
const { Registration } = require("../models/userModel");
const contentServices = require("../services/contentServices");
// const sendResponse = require('../helper/responseSender');
require("dotenv").config();
const ASSET_URL = process.env.ASSET_URL;

var Storage = multer.diskStorage({
  destination: "./public/content",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: Storage,
}).single("file");

const addContent = async function (req, res) {
  console.log("postmethod add content");
  console.log(req.body);
  try {

    let content = await contentServices.addContent(req, res);
    console.log("content", content);
    if (content) {
      // return sendResponse(res, 200, { status: true, data : content, message: "Content Added successfully" });
      res.send({ data: content, message: "Content Added successfully" });
    } else {
      // return sendResponse(res, 400, { status: false, message: "Adding content failed!" });
      res.send({ message: "Adding content failed!" });
    }
  } catch (error) {
    // return sendResponse(res, 500, { status: false, message: "Something went wrong" });
    res.send({ message: "Something went wrong" });
  }
};

const editContent = async function (req, res) {
  console.log("postmethod add content");
  try {
    let content = await contentServices.getContent(req.body._id);

    // validations
    if (content == null || content == undefined || content == "") {
      // return sendResponse(res, 400, { status: false, message: "Invalid content" });
      res.send({ message: "Invalid content" });
    }

    let filename = "";
    if (req.file) {
      console.log("wit image");
      filename = req.file.filename;
    } else {
      console.log("without image");
      filename = content.image;
    }
    let update = await contentServices.updateContent(filename, req.body);
    console.log("update", update);
    if (update) {
      content = await contentServices.getContent(req.body._id);
      // return sendResponse(res, 200, { status: true, data : content, message: "Content updated successfully" });
      res.send({ data: content, message: "Content updated successfully" });
    } else {
      // return sendResponse(res, 400, { status: false, message: "Content updation failed" });
      res.send({ message: "Content updation failed" });
    }
  } catch (error) {
    // return sendResponse(res, 500, { status: false, message: "Something went wrong" });
    res.send({ message: "Something went wrong" });
  }
};

const deleteContent = async function (req, res) {
  console.log("postmethod delete content");

  try {
    let content = await contentServices.getContent(req.body._id);

    // validations
    if (content == null || content == undefined || content == "") {
      // return sendResponse(res, 400, { status: false, message: "Invalid content" });
      res.send({ message: "Invalid content" });
    }

    let del = await contentServices.deleteContent(req.body._id);
    if (del) {
      // return sendResponse(res, 200, { status: true, data : del, message: "Content deleted successfully" });
      res.send({ data: del, message: "Content deleted successfully" });
    } else {
      // return sendResponse(res, 400, { status: false, message: "Content deletion failed" });
      res.send({ message: "Content deletion failed" });
    }
  } catch (error) {
    // return sendResponse(res, 500, { status: false, message: "Something went wrong" });
    res.send({ message: "Something went wrong" });
  }
};
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

const getDataFromOpen = async (req, res) => {

  let order_direction = "desc";
  let offset = req.body.offset;
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

    console.log("done");

  res.send('done')
};

const getTraitFilter = async (req, res) => {
    let opencontent = await contentServices.getTraitFilters();
    res.send(opencontent)
};

module.exports = {
  content,
  addContent,
  editContent,
  deleteContent,
  contentdetail,
  searchApi,
  // LimitedCollectionApi,
  categoryNft,
  getDataFromOpen,
  getTraitFilter
};
