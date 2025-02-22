const usersModel = require("../models/user.model");
const { hashPassword } = require("../utils/crypto");
const {
  createTokenPair,
  verifyToken,
  generateTokenToken,
  refreshToken,
} = require("../utils/jwt");
const { checkEmails, sendEmail } = require("../utils/email");
const tokenModel = require("../models/token.model");
require("dotenv").config();
const crypto = require("crypto");
const code = crypto.randomBytes(10).toString("hex").slice(0, 5).toUpperCase();
const tempCodes = {};

let UserService = {
  //REGISTER
  register: async (payload) => {
    try {
      const { name, email, password } = payload;
      console.log("Payload:", payload);

      // Kiểm tra xem email đã tồn tại chưa
      const checkEmail = await usersModel.findOne({ email });
      if (checkEmail) {
        throw new Error("Email đã tồn tại");
      }
      console.log("checkEmail", checkEmail);
      // Mã hóa mật khẩu
      let hashedPassword;
      try {
        hashedPassword = await hashPassword(password);
      } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Không thể mã hóa mật khẩu");
      }

      // Tạo người dùng mới
      const newUser = await usersModel.insertMany({
        name,
        email,
        password: hashedPassword,
      });
      console.log("newUser", newUser);

      // Kiểm tra xem người dùng đã được tạo thành công chưa
      if (!newUser || newUser.length === 0) {
        throw new Error("Không thể tạo tài khoản");
      }

      // Tạo token pair
      const user_id = newUser[0]._id.toString();
      const verify = newUser[0].verified;
      let result;
      try {
        result = await createTokenPair(
          { user_id, verify },
          process.env.JWT_SECRET
        );
      } catch (error) {
        console.error("Error creating token pair:", error);
        throw new Error("Không thể tạo token");
      }

      return result;
    } catch (e) {
      console.error("Error in register function:", e);
      throw new Error("Không thể tạo tài khoản");
    }
  },

  // LOGIN
  login: async (payload) => {
    const { email, password } = payload;

    const user = await usersModel.findOne({ email: email });
    if (!user) {
      throw new Error("Không tìm thấy user");
    }
    user_id = user._id.toString();
    verify = user.verified;
    //create token pair
    const token = await createTokenPair(
      { user_id, verify },
      process.env.JWT_SECRET
    );
    const decoded_refresh_token = await verifyToken(
      token.refreshToken,
      process.env.JWT_SECRET
    );
    //insertOneToken into database

    const refreshToken = token.refreshToken;
    const exp = decoded_refresh_token.exp;

    const exps = await new Date(exp * 1000);
    const filter = { user_id },
      update = {
        refreshTokensUsed: [],
        exp,
        refreshToken,
      },
      option = { upsert: true, new: true };
    const newKeyToken = await tokenModel.findOneAndUpdate(
      filter,
      update,
      option
    );

    return {
      user,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  },

  // logout: async (payload) = {

  // },

  //add a address
  addAddress: async (userId, address) => {
    try {
      // Find the user by userId
      const user = await usersModel.findById(userId);
      if (!user) {
        throw new Error({ message: "Không tìm thấy người dùng" });
      }
      // Add the new address to the addresses array
      user.addresses.push(address);
      // Save the updated user document
      await user.save();
      return user;
    } catch (error) {
      console.error("Error adding address:", error);
      throw new Error("Không thêm được địa chỉ ");
    }
  },

  //get a address
  getAdress: async (user_id) => {
    try {
      const user = await usersModel.findOne({ _id: user_id });
      return user.addresses;
    } catch (err) {
      throw new Error("Không tìm thấy địa chỉ");
    }
  },
  updateAddress: async (payload) => {
    try {
      const { user_id, address_id, addressData } = payload;
      console.log("payload", payload);
      const user = await usersModel.findOne({ _id: user_id });
      if (!user) {
        throw new Error("Không tìm thấy người dùng ");
      }
      const address = user.addresses.id(address_id);
      if (!address) {
        throw new Error("Không tìm thấy địa chỉ ");
      }
      // Update the address fields
      address.set(addressData);
      // Save the updated user document
      await user.save();
    } catch (error) {
      console.error("Error updating address:", error);
      throw new Error("Không thể cập nhật địa chỉ ");
    }
  },
  deleteAddress: async (userId, addressId) => {
    try {
      const user = await usersModel.findOne({ _id: userId });
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Tìm địa chỉ dựa trên address_id
      const foundAddress = user.addresses.find(
        (address) => address._id.toString() === addressId.toString()
      );
      if (!foundAddress) {
        throw new Error("Không tìm thấy địa chỉ");
      }

      // Lấy index của địa chỉ trong mảng addresses
      const addressIndex = user.addresses.findIndex(
        (address) => address._id.toString() === addressId.toString()
      );

      // Xóa địa chỉ khỏi mảng addresses của người dùng
      user.addresses.splice(addressIndex, 1);

      // Lưu tài liệu người dùng đã được cập nhật
      await user.save();

      console.log("Địa chỉ đã được xóa thành công");
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      throw new Error("Không thể xóa địa chỉ");
    }
  },

  // get profie
  getme: async (user_id) => {
    try {
      const user = await usersModel.findOne({ _id: user_id });
      console.log("user", user);
      return user;
    } catch (err) {
      throw new Error("Không tìm thấy người dùng");
    }
  },

  updateMe: async (payload) => {
    try {
      const { user_id, name, email, addresses } = payload;
      const user = await usersModel.findOneAndUpdate(
        { _id: user_id },
        {
          name,
          email,
          addresses,
        }
      );
      return user;
    } catch (err) {
      throw new Error("Không thể cập nhật thông tin");
    }
  },
  forgotPass: async (payload) => {
    try {
      const { email } = payload;
      const user = await usersModel.findOne({ email });

      if (!user) {
        throw new Error("Không tìm thấy user");
      }

      const code_verify = `${code}`;
      tempCodes[email] = code_verify;
      console.log("tempCodes", tempCodes);
      await sendEmail(
        email,
        "Gửi mã Xác nhận",
        "Mã xác nhận của bạn là: " + code_verify + ""
      );
      console.log("code_verify", code_verify);
      return { code_verify };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Không thể gửi mã xác nhận");
    }
  },

  resetPass: async (payload) => {
    try {
      const { email, code, newPassword } = payload;
      console.log(tempCodes[email]);
      console.log(code);
      if (!email || !code || !newPassword) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }
      if (tempCodes[email] !== code) {
        throw new Error("Mã xác nhận không chính xác");
      }

      delete tempCodes[email];
      const hashedPassword = await hashPassword(newPassword);
      try {
        const user = await usersModel.findOneAndUpdate(
          { email },
          { password: hashedPassword }
        );
        console.log(user);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  changePassword: async (payload) => {
    try {
      const { email, password, newPassword } = payload;
      const user = await usersModel.findOne({ email });
      if (!user) {
        throw new Error("Không tìm thấy user");
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error("Mật khẩu không chính xác");
      }
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await usersModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = UserService;
