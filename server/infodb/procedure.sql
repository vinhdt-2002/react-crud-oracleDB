PROCEDURE vinh_get_all_customers(
  p_result OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN p_result FOR
    SELECT CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE
    FROM EX_REACT_Customer;
END vinh_get_all_customers;


PROCEDURE vinh_get_customer_by_id(
  p_customer_id IN NUMBER,
  p_customer_data OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN p_customer_data FOR
    SELECT CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE
    FROM EX_REACT_Customer
    WHERE CUSTOMER_ID = p_customer_id;
END vinh_get_customer_by_id;


PROCEDURE vinh_add_customer(
  p_customer_type IN VARCHAR2,
  p_name IN VARCHAR2,
  p_registration_date IN DATE,
  p_id_number IN VARCHAR2,
  p_address IN VARCHAR2,
  p_email IN VARCHAR2,
  p_phone IN VARCHAR2
) AS
BEGIN
  INSERT INTO EX_REACT_Customer (
    CUSTOMER_TYPE,
    NAME,
    REGISTRATION_DATE,
    ID_NUMBER,
    ADDRESS,
    EMAIL,
    PHONE
  ) VALUES (
    p_customer_type,
    p_name,
    p_registration_date,
    p_id_number,
    p_address,
    p_email,
    p_phone
  );
  COMMIT;
END vinh_add_customer;


PROCEDURE vinh_delete_customer(
  p_customer_id IN NUMBER
) AS
BEGIN
  DELETE FROM EX_REACT_Customer WHERE CUSTOMER_ID = p_customer_id;
  COMMIT;
END vinh_delete_customer;


PROCEDURE vinh_update_customer(
  p_customer_id IN NUMBER,
  p_customer_type IN VARCHAR2,
  p_name IN VARCHAR2,
  p_registration_date IN DATE,
  p_id_number IN VARCHAR2,
  p_address IN VARCHAR2,
  p_email IN VARCHAR2,
  p_phone IN VARCHAR2
) AS
BEGIN
  UPDATE EX_REACT_Customer
  SET
    CUSTOMER_TYPE = p_customer_type,
    NAME = p_name,
    REGISTRATION_DATE = p_registration_date,
    ID_NUMBER = p_id_number,
    ADDRESS = p_address,
    EMAIL = p_email,
    PHONE = p_phone
  WHERE CUSTOMER_ID = p_customer_id;
  COMMIT;
END vinh_update_customer;

