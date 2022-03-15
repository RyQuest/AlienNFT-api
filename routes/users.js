var express = require('express');
var router = express.Router();

const contentController = require('../controllers/ContentController')
const auth = require("../middleware/auth");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/content', contentController.content);

router.post('/search',contentController.searchApi);

// router.post('/limited-collection',contentController.LimitedCollectionApi);

router.get('/categories-nft',contentController.categoryNft);

router.post('/content-detail', contentController.contentdetail);

router.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});


module.exports = router;
