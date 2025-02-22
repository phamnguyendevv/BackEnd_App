const {
  getproController,
  addproController,
  addcatController,
  getcatController,
  getprobycateController,
  addorderController,
  getorderController,
  getAllProController,
  getcatebynameController,
} = require("../controllers/products.controller");


const express = require('express')
const router = express.Router()

router.post('/addproducts', addproController)
router.get('/getproducts', getproController)
router.get('/get-all-products', getAllProController)
router.post('/getprobycate', getprobycateController)







// -------------------categoris----------------

router.post('/addcategoris', addcatController)
router.get('/getcategoris', getcatController)
router.get('/category', getcatebynameController)





// -------------------------orders-------------------

router.get('/orders/:user_id', getorderController)
router.post('/orders', addorderController)




module.exports = router
