const axios = require("axios");
require("dotenv").config(); // Đảm bảo biến môi trường được load

const getAccessToken = async () => {
  try {
   
    const credentials = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Lỗi khi lấy Access Token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = { getAccessToken };
