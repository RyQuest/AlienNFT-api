const { contentInfo } = require("../models/Content");
const { OpenSeacontentInfo } = require("../models/openSeaContent");
const sendResponse = require("../helper/responseSender");

const getContent = async function (id) {
  let content = await OpenSeacontentInfo.findOne({ _id: id });
  if (content) {
    return content;
  } else {
    return null;
  }
};

const getAllContent = async function (query, page, limit, sort) {
  console.log("queryyyyyyyyyyyyy", query);
  console.log("sort", sort);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  const total = await OpenSeacontentInfo.countDocuments().exec();

  results.total = total;
  if (endIndex < total) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  if (query) {
    console.log("in query");
    try {
      let regex = new RegExp(query, "i");

      search_data = {
        $and: [
          { $or: [{ name: regex }, { attributes: regex }, { description: regex }] },
        ],
      };

      //  return await contentInfo.find(search_data).sort( {_id:-1 } );

      let painting = await OpenSeacontentInfo.find(search_data)
        .limit(limit)
        .skip(startIndex)
        .sort({
          price: 1,
        });
      results.content = painting;
      return results;
    } catch (e) {
      console.log(e);
    }
  } else {
    if (sort == "Newest") {
      console.log("Newest");
      let painting = await OpenSeacontentInfo.find()
        .limit(limit)
        .skip(startIndex)
        .sort({
          _id: -1,
        });
      results.content = painting;
      return results;
    } else if (sort == "Oldest") {
      console.log("Oldest");
      let painting = await OpenSeacontentInfo.find()
        .limit(limit)
        .skip(startIndex)
        .sort({
          _id: 1,
        });
      results.content = painting;
      return results;
    } else if (sort == "High") {
      console.log("price High");
      let painting = await OpenSeacontentInfo.find()
        .limit(limit)
        .skip(startIndex)
        .sort({
          price: -1,
        });
      results.content = painting;
      return results;
    } else {
      try {
        let painting = await OpenSeacontentInfo.find()
          .limit(limit)
          .skip(startIndex)
          .sort({
            price: 1,
          });
        results.content = painting;
        return results;
      } catch (e) {
        console.log(e);
      }
    }
  }
};

const search = async (data) => {
  try {
    console.log("data", data);
    let regex = new RegExp(data, "i");

    search_data = {
      status: "approved",
      $and: [
        { $or: [{ title: regex }, { price: regex }, { category: regex }] },
      ],
    };
    console.log("search_data", search_data);
    return await contentInfo.find(search_data).sort({ _id: -1 });
  } catch (e) {
    console.log(e);
  }
};

const LimitedCollection = async (category) => {
  let limit = 8;
  const results = {};

  try {
    let regex = new RegExp(category, "i");

    search_data = {
      status: "approved",
      $and: [{ $or: [{ category: regex }] }],
    };

    //  return await ContentInfo.find(search_data).sort( {_id:-1 } );

    let painting = await contentInfo.find(search_data).limit(limit);

    results.content = painting;
    return results;
  } catch (e) {
    console.log(e);
  }
};

const findContentbyId = async (content_id) => {
  try {
    let isUpdated = await contentInfo.findOne({ _id: content_id });
    return isUpdated;
  } catch (error) {
    console.log("error", error);
  }
};

const openSeadataSave = async function (obj) {
  const content = new OpenSeacontentInfo(obj);
  await content.save();
  return content;
};

const getOpenSeaContent = async function (obj) {
  const content = await OpenSeacontentInfo.findOne({ token_id: obj });
  return content;
};

const getTraitFilters = async function (req, res) {
  let traits = []
  let traits1 = []
  let traits2 = []
  let traits3 = []

  let data = await OpenSeacontentInfo.find()
  // hats
  data.forEach( async(element,index)=>{
        for (let index = 0; index < 3; index++) {
          if(element.attributes[index].trait_type == "hats"){
            // console.log("hats", element.attributes[index].value);
            let value = element.attributes[index].value
            value = value.toString()
            console.log("hats", value);

            traits.push(value)
          }
         
        }   
  });

  // character
  data.forEach( async(element,index)=>{
    for (let index = 0; index < 3; index++) {
      if(element.attributes[index].trait_type == "character"){
        // console.log("hats", element.attributes[index].value);
        let value = element.attributes[index].value
        value = value.toString()
        // console.log("character", value);

        traits1.push(value)
      }
     
    }   
});

// shrits
data.forEach( async(element,index)=>{
  for (let index = 0; index < 3; index++) {
    if(element.attributes[index].trait_type == "shirts"){
      // console.log("hats", element.attributes[index].value);
      let value = element.attributes[index].value
      value = value.toString()
      // console.log("shirts", value);

      traits2.push(value)
    }
   
  }   
});

// glasses
data.forEach( async(element,index)=>{
  for (let index = 0; index < 3; index++) {
    if(element.attributes[index].trait_type == "glasses"){
      // console.log("hats", element.attributes[index].value);
      let value = element.attributes[index].value
      value = value.toString()
      // console.log("glasses", value);

      traits3.push(value)
    }
   
  }   
});


  let hats = [...new Set(traits)];
  let character = [...new Set(traits1)];
  let shirts = [...new Set(traits2)];
  let glasses = [...new Set(traits3)];

  console.log("hats", hats);
  console.log("character", character);
  console.log("shirts", shirts);
  console.log("glasses", glasses);

  let obj = {
    hats,
    character,
    shirts,
    glasses
  }
 return obj
};

const addContent = async function (req, res) {
  let obj = {
    permalink : "https://testnets.opensea.io/assets/0x16f095cd018c9dbc671c1c96addc5ff4f5aa7f93/"+req.body.token_id,
    name : req.body.name,
    description : req.body.description,
    image_url : "https://gateway.ipfs.io/ipfs/"+req.body.image_url,
    image_url_thumbnail : "https://gateway.ipfs.io/ipfs/"+req.body.image_url_thumbnail,
    image_url_preview : "https://gateway.ipfs.io/ipfs/"+req.body.image_url_preview,
    token_id : req.body.token_id,
    status : "approved",
    date : new Date()
  }

  const content = new OpenSeacontentInfo(obj);
    await content.save();
    return content;
};

module.exports = {
  getContent,
  getAllContent,
  search,
  LimitedCollection,
  findContentbyId,
  openSeadataSave,
  getOpenSeaContent,
  getTraitFilters,
  addContent
};
