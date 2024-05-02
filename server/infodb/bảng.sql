DROP TABLE EX_REACT_Customer;

CREATE SEQUENCE customer_id_seq
  START WITH 1
  INCREMENT BY 1
  NOMAXVALUE;

CREATE TABLE EX_REACT_Customer (
    CUSTOMER_ID NUMBER DEFAULT customer_id_seq.NEXTVAL PRIMARY KEY,
    CUSTOMER_TYPE VARCHAR2(20) CHECK (CUSTOMER_TYPE IN ('Cá nhân', 'Tổ chức')) NOT NULL,
    NAME VARCHAR2(100) NOT NULL,
    REGISTRATION_DATE DATE NOT NULL,
    ID_NUMBER VARCHAR2(20) UNIQUE NOT NULL,
    ADDRESS VARCHAR2(200) NOT NULL,
    EMAIL VARCHAR2(100) UNIQUE NOT NULL,
    PHONE VARCHAR2(20) UNIQUE NOT NULL
);

INSERT INTO EX_REACT_Customer (CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE) 
VALUES (customer_id_seq.NEXTVAL, 'Cá nhân', 'Nguyễn Văn A', TO_DATE('1990-01-01', 'YYYY-MM-DD'), '123456789', 'Đường ABC, Quận XYZ, TP HCM', 'nguyenvana@example.com', '0123456789');

INSERT INTO EX_REACT_Customer (CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE) 
VALUES (customer_id_seq.NEXTVAL, 'Tổ chức', 'Công ty ABC', TO_DATE('2000-05-15', 'YYYY-MM-DD'), '123456', 'Đường XYZ, Quận ABC, TP Hà Nội', 'congtyabc@example.com', '0987654321');

INSERT INTO EX_REACT_Customer (CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE) 
VALUES (customer_id_seq.NEXTVAL, 'Cá nhân', 'Trần Thị B', TO_DATE('1985-07-10', 'YYYY-MM-DD'), '987654321', 'Đường XYZ, Quận ABC, TP Hà Nội', 'tranthib@example.com', '0369852147');

-- 2 more INSERT statements
INSERT INTO EX_REACT_Customer (CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE) 
VALUES (customer_id_seq.NEXTVAL, 'Tổ chức', 'Công ty XYZ', TO_DATE('2010-10-20', 'YYYY-MM-DD'), '789012', 'Đường UVW, Quận DEF, TP Hồ Chí Minh', 'congtyxyz@example.com', '0123456789');

INSERT INTO EX_REACT_Customer (CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE) 
VALUES (customer_id_seq.NEXTVAL, 'Cá nhân', 'Lê Văn C', TO_DATE('1988-03-25', 'YYYY-MM-DD'), '456789012', 'Đường MNO, Quận GHI, TP Hà Nội', 'levanc@example.com', '0987654321');

SELECT * FROM EX_REACT_Customer;

COMMIT;

constructor() {
  this.OracleDB = OracleDB;
  this.dbConfig = {
    user: "TRAINING",
    password: "training123",
    connectString:
      "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST=192.168.1.188)(PORT = 1521))(CONNECT_DATA =(SERVICE_NAME='DB')))",
  };
}

  constructor() {
    this.OracleDB = OracleDB;
    this.dbConfig = {
      user: "sys",
      password: "Vjnhdatabase2k2",
      connectString: "localhost/orcl",
      privilege: OracleDB.SYSDBA,
    };
  }



