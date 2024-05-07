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
        vinh_add_customer(:CUSTOMER_TYPE, :NAME, TO_DATE(:REGISTRATION_DATE, 'YYYY-MM-DD'), :ID_NUMBER, :ADDRESS, :EMAIL, :PHONE, :p_err_code, :p_err_msg);
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
      p_err_code: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_err_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    };

    const connection = await dbConnection.connectWithDB();

    const result = await connection.execute(insertQuery, bindValues);
    console.log("Error code:", result.outBinds.p_err_code); // In ra giá trị của p_err_code
    console.log("Error message:", result.outBinds.p_err_msg); // In ra giá trị của p_err_msg

    if (result.outBinds.p_err_code === 0) {
      res.status(201).json({ message: "Thêm khách hàng thành công" });
    } else {
      res.status(400).json({
        errorCode: result.outBinds.p_err_code,
        errorMessage: result.outBinds.p_err_msg,
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm khách hàng:", error);
    res.status(500).json({
      errorMessage: "Lỗi khi thêm khách hàng vào cơ sở dữ liệu",
    });
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

    const {
      CUSTOMER_TYPE,
      NAME,
      REGISTRATION_DATE,
      ID_NUMBER,
      ADDRESS,
      EMAIL,
      PHONE,
    } = req.body;

    if (
      REGISTRATION_DATE &&
      !moment(REGISTRATION_DATE, "YYYY-MM-DD", true).isValid()
    ) {
      return res.status(400).json({
        error: "Ngày sinh không hợp lệ. Định dạng phải là YYYY-MM-DD",
      });
    }

    const formattedDate = REGISTRATION_DATE
      ? moment(REGISTRATION_DATE).format("YYYY-MM-DD")
      : null;

    console.log("Updating customer with ID:", customerId);
    console.log("Updated customer data:", req.body);

    const updateProcedure = `
      BEGIN
        vinh_update_customer(
          :p_customer_id,
          :p_customer_type,
          :p_name,
          TO_DATE(:p_registration_date, 'YYYY-MM-DD'),
          :p_id_number,
          :p_address,
          :p_email,
          :p_phone,
          :p_err_code,
          :p_err_msg
        );
      END;
    `;

    const bindValues = {
      p_customer_id: customerId,
      p_customer_type: CUSTOMER_TYPE,
      p_name: NAME,
      p_registration_date: formattedDate,
      p_id_number: ID_NUMBER,
      p_address: ADDRESS,
      p_email: EMAIL,
      p_phone: PHONE,
      p_err_code: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_err_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    };

    await dbConnection.init();
    const connection = await dbConnection.connectWithDB();

    const result = await connection.execute(updateProcedure, bindValues);
    if (result.outBinds.p_err_code == 0) {
      res.status(201).json({ message: "Cập nhật thông tin thành công" });
    } else {
      res.status(409).json({
        errorCode: result.outBinds.p_err_msg,
        errorMessage: result.outBinds.p_err_msg,
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật thông tin khách hàng" });
  }
};
