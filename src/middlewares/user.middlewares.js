const usersModel = require('../models/user.model');
const {validate}= require('../utils/validation');
const { checkSchema, validationResult, check } = require('express-validator');
const {ErrorWithStatus} = require('../models/Errors.model');
// const USERS_MESSAGES = require('../constants/messages');
// const DatabaseServices = require('../services/database.services');
const {verifyToken} = require('../utils/jwt');
const { Error } = require('mongoose');
const {hashPassword} = require('../utils/crypto')
const bcrypt= require('bcrypt');
require('dotenv').config();

const userSchema = {
  custom:{
    options: async (value,{req}) => {
      const user = await usersModel.findOne({email:value});
      if (!user) {
        throw new ErrorWithStatus({message: "User not found",status: 400});
      }
      req.user = user;
      return true;
    },
  },
}

const loginValidator = validate(checkSchema({
  email: userSchema,
  password: {
    trim: true,
    isLength: {
      options: { min: 2},
      errorMessage: 'Password must be at least 6 characters long',
    },custom: {
      options: async (value,{req}) => {
        const isMatch = await bcrypt.compare(value, req.user.password);
        if (!isMatch) {
          throw new Error("Nhập sai mật khẩu ");
        }
        return true;
      },
    },
  },
},['body']));



module.exports = {
  loginValidator,
}



