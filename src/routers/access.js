const express = require("express");
const {
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
} = require("../controllers/users.controller");

const wrapAsync = require("../utils/handlers");
const { getAccessToken } = require("../utils/paypal");
const axios = require("axios");

const router = express.Router();

router.post("/login", wrapAsync(loginController));
router.post("/register", wrapAsync(registerController));

router.post("/forgot-password", wrapAsync(forgotPassController));
//send email to user to change password
router.post("/reset-password", wrapAsync(resetPassController));

router.post("/change-password", wrapAsync(changePasswordController));
// //log out
// router.post('logout', logoutController)

router.get("/address/:user_id", wrapAsync(getAdressController));
router.post("/address", wrapAsync(addressesController));
router.put("/address", wrapAsync(updateAddressesController));
router.delete("/address", wrapAsync(deleteAddressController));

router.get("/me/:user_id", wrapAsync(meController));
router.put("/me", wrapAsync(updateMeController));

//------------------ paypal -------------------

//  paypal payment
router.get("/pay/:amount", async (req, res) => {
  try {
    const { amount } = req.params;
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.APP_URL}/success`,
          cancel_url: `${process.env.APP_URL}/cancel`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approvalUrl = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;
    console.log("approvalUrl", approvalUrl);
    res.redirect(approvalUrl);
  } catch (error) {
    console.error(
      "Lỗi khi tạo thanh toán:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Lỗi khi tạo thanh toán" });
  }
});

// Keep the capture-payment route as is
// API để capture payment
router.get("/capture-payment", async (req, res) => {
  try {
    console.log("req.query", req.query);
    const { token } = req.query; // Lấy token từ query parameter
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const accessToken = await getAccessToken(); // Lấy access token

    // Gọi API của PayPal để capture payment
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Trả về phản hồi từ PayPal
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Lỗi khi capture payment:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Lỗi khi capture payment" });
  }
});

router.get("/success", async (req, res) => {
  try {
    const { token } = req.query; // Lấy token từ query parameter
    if (!token) {
      return res.status(400).send("Token is required");
    }

    const accessToken = await getAccessToken(); // Lấy access token

    // Gọi API để capture payment
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Kiểm tra trạng thái thanh toán
    if (response.data.status === "COMPLETED") {
      return res.status(200).json({
        status: "success",
        message: "Payment completed",
      });
    } else {
      // Xử lý trường hợp thanh toán không thành công
      return res
        .status(400)
        .json({ status: "failed", message: "Payment not completed" });
    }
  } catch (error) {
    console.error(
      "Lỗi khi xử lý thanh toán:",
      error.response?.data || error.message
    );
    res.status(500).send("Lỗi khi xử lý thanh toán");
  }
});

module.exports = router;
