--------------------------------------------------------get all

PROCEDURE vinh_get_all_customers(
  p_result OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN p_result FOR
    SELECT CUSTOMER_ID, CUSTOMER_TYPE, NAME, REGISTRATION_DATE, ID_NUMBER, ADDRESS, EMAIL, PHONE
    FROM EX_REACT_Customer;
END vinh_get_all_customers;

--------------------------------------------------------get id

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

--------------------------------------------------------add
PROCEDURE vinh_add_customer(
  p_customer_type IN VARCHAR2,
  p_name IN VARCHAR2,
  p_registration_date IN DATE,
  p_id_number IN VARCHAR2,
  p_address IN VARCHAR2,
  p_email IN VARCHAR2,
  p_phone IN VARCHAR2,
  p_err_code OUT NUMBER,
  p_err_msg OUT VARCHAR2
) AS
  email_count NUMBER;
  phone_count NUMBER;
  id_number_count NUMBER;
BEGIN
  -- Kiểm tra sự tồn tại của email, số điện thoại, và số CMND/CCCD
  SELECT COUNT(*) INTO email_count FROM EX_REACT_Customer WHERE EMAIL = p_email;
  SELECT COUNT(*) INTO phone_count FROM EX_REACT_Customer WHERE PHONE = p_phone;
  SELECT COUNT(*) INTO id_number_count FROM EX_REACT_Customer WHERE ID_NUMBER = p_id_number;

  IF email_count > 0 THEN
    p_err_code := -2;
    p_err_msg := 'Email đã tồn tại!';
    RETURN;
  END IF;

  IF phone_count > 0 THEN
    p_err_code := -3;
    p_err_msg := 'Số điện thoại đã tồn tại!';
    RETURN;
  END IF;

  IF id_number_count > 0 THEN
    p_err_code := -4;
    p_err_msg := 'Số CMND/CCCD đã tồn tại!';
    RETURN;
  END IF;

  -- Thêm khách hàng vào bảng
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
    
    p_err_code := 0;
    p_err_msg := 'Thêm dữ liệu thành công';
  EXCEPTION
    WHEN OTHERS THEN
      p_err_code := SQLCODE;
      p_err_msg := SQLERRM;
      IF SQLCODE = -2290 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Lỗi: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
      END IF;
  END;

  COMMIT;
END vinh_add_customer;


--------------------------------------------------------delete
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

--------------------------------------------------------update
PROCEDURE vinh_update_customer(
    p_customer_id IN NUMBER,
    p_customer_type IN VARCHAR2,
    p_name IN VARCHAR2,
    p_registration_date IN DATE,
    p_id_number IN VARCHAR2,
    p_address IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_err_code OUT NUMBER,
    p_err_msg OUT VARCHAR2
)
AS
BEGIN
    SELECT COUNT(*)
    INTO p_err_code
    FROM EX_REACT_Customer
    WHERE EMAIL = p_email AND CUSTOMER_ID != p_customer_id;

    SELECT COUNT(*)
    INTO p_err_msg
    FROM EX_REACT_Customer
    WHERE PHONE = p_phone AND CUSTOMER_ID != p_customer_id;

    SELECT COUNT(*)
    INTO p_err_code
    FROM EX_REACT_Customer
    WHERE ID_NUMBER = p_id_number AND CUSTOMER_ID != p_customer_id;

    IF p_err_code > 0 THEN
        IF p_err_code = 1 THEN
            p_err_code := -1;
            p_err_msg := 'Email đã tồn tại!';
        ELSIF p_err_msg = 2 THEN
            p_err_code := -2;
            p_err_msg := 'Số điện thoại đã tồn tại!';
        ELSE
            p_err_code := -3;
            p_err_msg := 'Số CMND/CCCD đã tồn tại!';
        END IF;
    ELSE
        UPDATE EX_REACT_Customer
        SET
            CUSTOMER_TYPE = p_customer_type,
            NAME = p_name,
            REGISTRATION_DATE = p_registration_date,
            ID_NUMBER = p_id_number,
            ADDRESS = p_address,
            EMAIL = p_email,
            PHONE = p_phone
        WHERE
            CUSTOMER_ID = p_customer_id;
        p_err_code := 0;
        p_err_msg := 'Cập nhật thành công';
        COMMIT;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        p_err_code := SQLCODE;
        p_err_msg := SQLERRM;
        ROLLBACK;
END vinh_update_customer;
