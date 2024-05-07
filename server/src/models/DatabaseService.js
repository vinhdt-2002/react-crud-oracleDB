const OracleDB = require("oracledb");

const dotenv = require("dotenv");
dotenv.config();

class DatabaseConnection {
  constructor() {
    this.OracleDB = OracleDB;
    this.dbConfig = {
      user: "sys",
      password: "Vjnhdatabase2k2",
      connectString: "localhost/orcl",
      privilege: OracleDB.SYSDBA,
    };
  }

  async init() {
    await this.connectWithDB();
  }

  async connectWithDB() {
    return new Promise((resolve, reject) => {
      this.OracleDB.getConnection(this.dbConfig, (err, connection) => {
        if (err) {
          reject(err.message);
        }
        this.connection = connection;
        resolve(connection);
      });
    });
  }

  async execute(SQL, binds = []) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.connection) {
          await this.init();
        }
        const result = await this.connection.execute(SQL, binds);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute_proc(SQL, binds = {}) {
    return new Promise((resolve, reject) => {
      this.connectWithDB()
        .then(async (connection) => {
          if (
            !binds.hasOwnProperty("CUSTOMER_TYPE") ||
            !binds.hasOwnProperty("NAME") ||
            !binds.hasOwnProperty("REGISTRATION_DATE") ||
            !binds.hasOwnProperty("ID_NUMBER") ||
            !binds.hasOwnProperty("ADDRESS") ||
            !binds.hasOwnProperty("EMAIL") ||
            !binds.hasOwnProperty("PHONE")
          ) {
            reject("Missing bind values");
            return;
          }
          const result = await connection.execute(SQL, binds);
          resolve(result);
          this.doRelease(connection);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  doRelease(connection) {
    connection.release((err) => {
      if (err) console.error(err.message);
      console.log("Connection released");
    });
  }
}

module.exports = DatabaseConnection;
