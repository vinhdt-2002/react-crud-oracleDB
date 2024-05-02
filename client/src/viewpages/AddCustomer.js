import { CardForm, CardHeader } from "components/ui/card";
import { Input } from "components/ui/input";
import { useState } from "react";
import { FaBirthdayCake } from "react-icons/fa";
import {
  FaBuildingUser,
  FaRegAddressCard,
  FaSquarePhone,
  FaUserPen,
} from "react-icons/fa6";
import { IoCardSharp } from "react-icons/io5";
import { MdCalendarMonth, MdEmail } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";
import { Link, Outlet } from "react-router-dom";
import { useDataContext } from "../api/DataContext";

function AddCustomer() {
  const { addCustomer } = useDataContext();

  const [formData, setFormData] = useState({
    CUSTOMER_TYPE: "Cá nhân",
    NAME: "",
    REGISTRATION_DATE: "",
    ID_NUMBER: "",
    ADDRESS: "",
    EMAIL: "",
    PHONE: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10,12}$/;
    return re.test(phoneNumber);
  };

  const validateIDNumber = (idNumber) => {
    const re = /^\d{5,10}$/;
    return re.test(idNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "CUSTOMER_TYPE",
      "NAME",
      "REGISTRATION_DATE",
      "ID_NUMBER",
      "ADDRESS",
      "EMAIL",
      "PHONE",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setAlertSuccess(false);
        setAlertMessage("Vui lòng điền đầy đủ thông tin.");
        return;
      }
    }

    if (!validateEmail(formData.EMAIL)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    if (!validatePhoneNumber(formData.PHONE)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập số điện thoại hợp lệ từ 10 đến 12 số.");
      return;
    }

    if (!validateIDNumber(formData.ID_NUMBER)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập số CCCD/CMND hợp lệ từ 5 đến 10 số.");
      return;
    }

    const success = addCustomer(formData);
    if (success) {
      setAlertSuccess(true);
      setAlertMessage("Khách hàng đã được thêm thành công.");
      setFormData({
        CUSTOMER_TYPE: "Cá nhân",
        NAME: "",
        REGISTRATION_DATE: "",
        ID_NUMBER: "",
        ADDRESS: "",
        EMAIL: "",
        PHONE: "",
      });
    } else {
      setAlertSuccess(false);
      setAlertMessage("Không thể thêm khách hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex-col justify-center items-center h-screen w-screen overflow-hidden bg-blue-200">
      <CardHeader className="text-center text-2xl mt-5">
        Thêm khách hàng mới
      </CardHeader>
      <CardForm
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        {alertMessage && (
          <div
            className={`text-center text-base my-3 ${
              alertSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {alertMessage}
          </div>
        )}
        <div className="text-base font-semibold my-3">Loại khách hàng:</div>
        <select
          className="w-1/4 p-1 rounded-md text-center border border-zinc-400 bg-transparent hover:ring-1"
          name="CUSTOMER_TYPE"
          value={formData.CUSTOMER_TYPE}
          onChange={handleChange}
        >
          <option value="Cá nhân">Cá nhân</option>
          <option value="Tổ Chức">Tổ chức</option>
        </select>

        {formData.CUSTOMER_TYPE === "Cá nhân" ? (
          <>
            <Input
              type="text"
              name="NAME"
              value={formData.NAME}
              onChange={handleChange}
              label="Họ và tên:"
              icon={<FaUserPen />}
              required
            />
            <Input
              type="date"
              name="REGISTRATION_DATE"
              value={formData.REGISTRATION_DATE}
              onChange={handleChange}
              label="Ngày sinh:"
              icon={<FaBirthdayCake />}
              required
            />
            <Input
              type="text"
              name="ID_NUMBER"
              value={formData.ID_NUMBER}
              onChange={handleChange}
              label="Số CCCD/CMND:"
              icon={<FaRegAddressCard />}
              required
            />
          </>
        ) : (
          <>
            <Input
              type="text"
              name="NAME"
              value={formData.NAME}
              onChange={handleChange}
              label="Tên công ty:"
              icon={<FaBuildingUser />}
              required
            />
            <Input
              type="date"
              name="REGISTRATION_DATE"
              value={formData.REGISTRATION_DATE}
              onChange={handleChange}
              label="Ngày đăng ký:"
              icon={<MdCalendarMonth />}
              required
            />
            <Input
              type="text"
              name="ID_NUMBER"
              value={formData.ID_NUMBER}
              onChange={handleChange}
              label="Số ĐKKD:"
              icon={<IoCardSharp />}
              required
            />
          </>
        )}

        <Input
          type="text"
          name="ADDRESS"
          value={formData.ADDRESS}
          onChange={handleChange}
          label="Địa chỉ:"
          icon={<RiMapPin2Fill />}
          required
        />
        <Input
          type="email"
          name="EMAIL"
          value={formData.EMAIL}
          onChange={handleChange}
          label="Email:"
          icon={<MdEmail />}
          required
        />
        <Input
          type="tel"
          name="PHONE"
          value={formData.PHONE}
          onChange={handleChange}
          label="Điện thoại:"
          icon={<FaSquarePhone />}
          required
        />

        <div className="w-full flex justify-evenly items-center m-4">
          <button
            variant="secondary"
            className="text-black border p-2 hover:bg-green-400 rounded bg-green-200 border-zinc-400"
            type="submit"
          >
            Thêm khách hàng
          </button>
          <Link
            to="/customerlist"
            className="text-black hover:text-blue-700 w-fit text-sm font-semibold hover:underline ml-2"
          >
            Danh sách khách hàng
          </Link>
        </div>
      </CardForm>
      <Outlet />
    </div>
  );
}

export default AddCustomer;
