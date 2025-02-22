const ProductModel = require("../models/product.model");
const CategoriesModel = require("../models/category.model");
const usersModel = require("../models/user.model");
const OrderModel = require("../models/order.model");
const { ObjectId } = require("mongoose").Types;
const ProductService = {
  //GET ALL PRODUCTS
  async getProducts(page, size, keyword) {
    try {
      const startIndex = (page - 1) * size;
      let query = {};
      if (keyword) {
        query.title = { $regex: keyword, $options: "i" };
      }

      const products = await ProductModel.find(query)
        .skip(startIndex)
        .limit(size);
      return products;
    } catch (error) {
      throw new Error("Không lấy được sản phẩm");
    }
  },

  //GET ALL PRODUCTS
  async getAllProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Không lấy được sản phẩm");
    }
  },

  //ADD PRODUCT
  async addProducts(payload) {
    const {
      title,
      Price,
      image,
      color,
      size,
      carouselImages,
      offer,
      category_id,
    } = payload;
    try {
      const newProduct = await ProductModel.create({
        title,
        Price,
        image,
        carouselImages,
        color,
        size,
        offer,
        category_id: new ObjectId(category_id),
      });
      console.log("newProduct", newProduct);
    } catch (error) {
      console.log("error adding product", error);
      throw new Error("Không thêm được sản phẩm");
    }
  },
  //GET PRODUCT BY CATEGORY
  async getProductsbycate(category_id) {
    try {
      console.log("data", category_id);
      const categoryId = new ObjectId(category_id);
      const category = await CategoriesModel.findById(categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }
      const products = await ProductModel.find({
        category_id: categoryId,
      });
      return products;
    } catch (error) {
      const products = await ProductModel.find();
      return products;
    }
  },
  // ------------------category----------------------

  //ADD CATEGORY
  async addCategory(payload) {
    const { name, image } = payload;
    try {
      const newCategory = await CategoriesModel.create({
        name,
        image,
      });
      console.log("newCategory", newCategory);
    } catch (error) {
      console.log("error adding category", error);
      throw new Error("Không thêm được danh mục");
    }
  },
  async getCategory() {
    try {
      const category = await CategoriesModel.find();
      return category;
    } catch (error) {
      throw new Error("Không lấy được danh mục");
    }
  },
  async getCategoryByName(name) {
    try {
      const category = await CategoriesModel.findOne({ name });
      return category;
    } catch (error) {
      throw new Error("Không lấy được danh mục");
    }
  },

  // Get orders
  async getOrders(user_id) {
    try {
      const orders = await OrderModel.find({ user: user_id }).populate("user");
      if (!orders || orders.length === 0) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      return orders;
    } catch (err) {
      throw new Error("Không tìm thấy đơn hàng");
    }
  },

  //UPDATE PRODUCT
  async addOrder(payload) {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      payload;
    try {
      const user = await usersModel.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      //create an array of product objects from the cart Items
      const products = cartItems.map((item) => ({
        name: item?.title,
        quantity: item.quantity,
        price: item.price,
        image: item?.image,
      }));
      //create a new Order
      const order = new OrderModel({
        user: userId,
        products: products,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });
      await order.save();
      console.log("order", order);
    } catch (error) {
      console.log("error creating orders", error);
      throw new Error("Không thêm được đơn hàng");
    }
  },
};

module.exports = ProductService;
