const express = require('express')
const cors = require('cors'); // Cần cài đặt thư viện cors
const defaultErrorHandler = require('./src/middlewares/errors.middlewares')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Cấu hình CORS
app.use(cors({
    // origin: 'http://172.20.10.4:8081', // Chỉ cho phép yêu cầu từ domain.com
    origin: '*', // Cho phép yêu cầu từ bất kỳ nguồn nào
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được cho phép
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// init db 
require('./src/dbs/init.mongodb')
// // init routes
app.use('/', require('./src/routers/index'))

app.use(defaultErrorHandler)




module.exports = app