// Trong file customerRoutes.js

const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

// GET /customers - Lấy danh sách khách hàng
router.get("/customers", customerController.getCustomers);

// GET /customers/:customerId - Lấy thông tin khách hàng theo ID
router.get("/customers/:customerId", customerController.getCustomerById);

// POST /customers - Thêm mới khách hàng
router.post("/customers", customerController.addCustomer);

// DELETE /customers/:customerId - Xóa khách hàng
router.delete("/customers/:customerId", customerController.deleteCustomer);

// PUT /customers/:customerId - Sửa khách hàng
router.put("/customers/:customerId", customerController.updateCustomer);

module.exports = router;
