const ProductService = require("../services/products.services");
require("dotenv").config();

//get all product

const getproController = async (req, res) => {
  const { page, size, keyword } = req.query;
  const result = await ProductService.getProducts(page, size, keyword);
  return res.json({
    message: "get all products",
    result,
  });
};
const getAllProController = async (req, res) => {
  const result = await ProductService.getAllProducts();
  return res.json({
    message: "get all products",
    result,
  });
};

// add product
const addproController = async (req, res) => {
  const result = await ProductService.addProducts(req.body);
  return res.json({
    message: "add products",
    result,
  });
};

//get product by category
const getprobycateController = async (req, res) => {
  const { categoryId } = req.body;
  console.log("category", categoryId);
  const result = await ProductService.getProductsbycate(categoryId);
  return res.json({
    message: "get products by category",
    result,
  });
};

// -----------------------------category------------------

// add category
const addcatController = async (req, res) => {
  const result = await ProductService.addCategory(req.body);
  return res.json({
    message: "add category",
    result,
  });
};
//get all category
const getcatController = async (req, res) => {
  const result = await ProductService.getCategory();
  return res.json({
    message: "get all category",
    result,
  });
};

const getcatebynameController = async (req, res) => {
  const { name } = req.body;
  const result = await ProductService.getCategoryByName(name);
  return res.json({
    message: "get category by name",
    result,
  });
};

// -----------------------------orders------------------

const addorderController = async (req, res) => {
  const result = await ProductService.addOrder(req.body);
  return res.json({
    message: "add orders successfull ",
    result,
  });
};

const getorderController = async (req, res) => {
  const { user_id } = req.params;
  const result = await ProductService.getOrders(user_id);
  return res.json({
    message: "get all orders",
    result,
  });
};

//get product by id
module.exports = {
  getproController,
  addproController,
  addcatController,
  getcatController,
  getprobycateController,
  addorderController,
  getorderController,
  getAllProController,
  getcatebynameController,
  getproController,
};
