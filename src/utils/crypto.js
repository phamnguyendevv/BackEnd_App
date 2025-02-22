
require('dotenv').config()
const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)

// Sử dụng bcrypt.genSalt để tạo salt
async function hashPassword(password) {
    return bcrypt.hash(password, salt);
}

module.exports = {
    hashPassword
} 


