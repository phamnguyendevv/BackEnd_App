const UserService = require("../services/users.services");
require("dotenv").config();

const loginController = async (req, res) => {
  console.log("req.body", req.body);
  const result = await UserService.login(req.body);
  return res.json({
    message: "User login",
    result,
  });
};

const registerController = async (req, res) => {
  const result = await UserService.register(req.body);
  return res.json({
    message: "User created",
    result,
  });
};

const addressesController = async (req, res) => {
  const { userId, address } = req.body;

  const result = await UserService.addAddress(userId, address);
  return res.json({
    message: "User created",
    result,
  });
};
const getAdressController = async (req, res) => {
  const { user_id } = req.params;
  const result = await UserService.getAdress(user_id);
  return res.json({
    result,
  });
};

const updateAddressesController = async (req, res) => {
  const result = await UserService.updateAddress(req.body);
  return res.json({
    message: "update successful",
    result,
  });
};

const deleteAddressController = async (req, res) => {
  const { userId, addressId } = req.body;
  console.log("userId", req.body);
  const result = await UserService.deleteAddress(userId, addressId);
  return res.json({
    message: "delete successful",
    result,
  });
};

const meController = async (req, res) => {
  const { user_id } = req.params;
  const result = await UserService.getme(user_id);
  return res.json({
    message: "get me successful",
    result,
  });
};

const updateMeController = async (req, res) => {
  const result = await UserService.updateMe(req.body);
  return res.json({
    message: "update successful",
  });
};

const forgotPassController = async (req, res) => {
  const result = await UserService.forgotPass(req.body);
  console.log("result", result);
  return res.json({
    result,
  });
};
const resetPassController = async (req, res) => {
  const result = await UserService.resetPass(req.body);
  return res.json({
    message: "reset password",
    result,
  });
};

const changePasswordController = async (req, res) => {
  const result = await UserService.changePassword(req.body);
  return res.json({
    message: "change password",
    result,
  });
};

module.exports = {
  loginController,
  registerController,
  addressesController,
  meController,
  getAdressController,
  updateAddressesController,
  deleteAddressController,
  updateMeController,
  forgotPassController,
  resetPassController,
  changePasswordController,
};
