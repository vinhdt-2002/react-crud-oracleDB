const moment = require("moment");
const oracledb = require("oracledb");
const DatabaseConnection = require("../models/DatabaseService");

const dbConnection = new DatabaseConnection();

exports.getCustomers = async (req, res) => {
  try {
    await dbConnection.init();

    const bindVariables = {
      result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const connection = await dbConnection.connectWithDB();

    const result = await connection.execute(
      "BEGIN vinh_get_all_customers(:result); END;",
      bindVariables
    );

    const data = [];
    const cursor = result.outBinds.result;

    let row;
    while ((row = await cursor.getRow())) {
      const customer = {
        CUSTOMER_ID: row[0],
        CUSTOMER_TYPE: row[1],
        NAME: row[2],
        REGISTRATION_DATE: row[3],
        ID_NUMBER: row[4],
        ADDRESS: row[5],
        EMAIL: row[6],
        PHONE: row[7],
      };
      data.push(customer);
    }

    await cursor.close();

    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ cơ sở dữ liệu" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    await dbConnection.init();

    const bindVariables = {
      customerId: customerId,
      customerData: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const connection = await dbConnection.connectWithDB();

    const result = await connection.execute(
      "BEGIN vinh_get_customer_by_id(:customerId, :customerData); END;",
      bindVariables
    );

    const cursor = result.outBinds.customerData;

    let customerData = {};
    let row;
    while ((row = await cursor.getRow())) {
      customerData = {
        CUSTOMER_ID: row[0],
        CUSTOMER_TYPE: row[1],
        NAME: row[2],
        REGISTRATION_DATE: row[3],
        ID_NUMBER: row[4],
        ADDRESS: row[5],
        EMAIL: row[6],
        PHONE: row[7],
      };
    }

    await cursor.close();

    if (Object.keys(customerData).length === 0) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    res.status(200).json(customerData);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin khách hàng từ cơ sở dữ liệu" });
  }
};

exports.addCustomer = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const {
      CUSTOMER_TYPE,
      NAME,
      REGISTRATION_DATE,
      ID_NUMBER,
      ADDRESS,
      EMAIL,
      PHONE,
    } = req.body;

    await dbConnection.init();

    // Kiểm tra và chuyển đổi định dạng ngày
    const formattedDate = moment(REGISTRATION_DATE, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    const insertQuery = `
      BEGIN
        vinh_add_customer(:CUSTOMER_TYPE, :NAME, TO_DATE(:REGISTRATION_DATE, 'YYYY-MM-DD'), :ID_NUMBER, :ADDRESS, :EMAIL, :PHONE);
      END;
    `;

    const bindValues = {
      CUSTOMER_TYPE,
      NAME,
      REGISTRATION_DATE: formattedDate,
      ID_NUMBER,
      ADDRESS,
      EMAIL,
      PHONE,
    };

    const connection = await dbConnection.connectWithDB();

    await connection.execute(insertQuery, bindValues);

    res.status(201).json({ message: "Thêm khách hàng thành công" });
  } catch (error) {
    if (error && error.code === "ORA-00001") {
      console.error("Lỗi khi thêm khách hàng:", error);
      res.status(400).json({ error: "Email hoặc số điện thoại đã tồn tại" });
    } else {
      console.error("Lỗi khi thêm khách hàng:", error);
      res
        .status(500)
        .json({ error: "Lỗi khi thêm khách hàng vào cơ sở dữ liệu" });
    }
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    await dbConnection.init();

    const deleteProcedure = `
      BEGIN
        vinh_delete_customer(:customerId);
      END;
    `;

    const bindValues = { customerId };

    const connection = await dbConnection.connectWithDB();

    await connection.execute(deleteProcedure, bindValues);

    res.json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xóa khách hàng:", error);
    res.status(500).json({ success: false });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const { type, fullName, birthday, idNumber, address, email, phone } =
      req.body;

    if (birthday && !moment(birthday, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        error: "Ngày sinh không hợp lệ. Định dạng phải là YYYY-MM-DD",
      });
    }

    const formattedDate = birthday
      ? moment(birthday).format("YYYY-MM-DD")
      : null;

    console.log("Updating customer with ID:", customerId);
    console.log("Updated customer data:", req.body);

    const updateProcedure = `
      BEGIN
        vinh_update_customer(
          :customerId,
          :type,
          :fullName,
          TO_DATE(:birthday, 'YYYY-MM-DD'),
          :idNumber,
          :address,
          :email,
          :phone
        );
      END;
    `;

    const bindValues = {
      customerId,
      type,
      fullName,
      birthday: formattedDate,
      idNumber,
      address,
      email,
      phone,
    };

    await dbConnection.init();
    const connection = await dbConnection.connectWithDB();

    await connection.execute(updateProcedure, bindValues);
    console.log("Customer updated successfully");

    res.json({ success: true });
  } catch (error) {
    if (error && error.code === "ORA-00001") {
      console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
      res.status(400).json({ error: "Email hoặc số điện thoại đã tồn tại" });
    } else {
      console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật thông tin khách hàng" });
    }
  }
};
