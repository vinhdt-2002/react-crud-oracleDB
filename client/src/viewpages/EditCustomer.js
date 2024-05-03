import { AlertError, AlertSuccess } from "components/ui/alert";
import { CardForm, CardHeader } from "components/ui/card";
import { Input } from "components/ui/input";
import moment from "moment";
import { useEffect, useState } from "react";
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
import { Link, useParams } from "react-router-dom";
import { useDataContext } from "../api/DataContext";

function EditCustomer() {
  const { id } = useParams();
  const { data, getCustomerById, updateCustomer } = useDataContext();
  const [formData, setFormData] = useState({
    type: "Cá nhân",
    fullName: "",
    birthday: "",
    idNumber: "",
    address: "",
    email: "",
    phone: "",
  });
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await getCustomerById(id);
        if (customer) {
          setFormData({
            type: customer.CUSTOMER_TYPE || "Cá nhân",
            fullName: customer.NAME || "",
            birthday:
              moment(customer.REGISTRATION_DATE).format("YYYY-MM-DD") || "",
            idNumber: customer.ID_NUMBER || "",
            address: customer.ADDRESS || "",
            email: customer.EMAIL || "",
            phone: customer.PHONE || "",
          });
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };
    fetchCustomer();
  }, [id, getCustomerById]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10,12}$/;
    return re.test(phoneNumber);
  };

  const validateIDNumber = (idNumber) => {
    const re = /^.{9}(.{3})?$/;
    return re.test(idNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAlertClick = () => {
    setErrorAlert(false);
    setSuccessAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingCustomer = data.find(
      (customer) =>
        customer.EMAIL === formData.email ||
        customer.PHONE === formData.phone ||
        customer.ID_NUMBER === formData.idNumber
    );

    if (existingCustomer) {
      setErrorAlert(true);
      setAlertMessage(
        `Đã tồn tại khách hàng với ${
          existingCustomer.EMAIL === formData.email
            ? "email này"
            : existingCustomer.PHONE === formData.phone
            ? "số điện thoại này"
            : "số CCCD/CMND này"
        }, Vui lòng nhập lại!`
      );
      return;
    }

    const requiredFields = [
      "fullName",
      "birthday",
      "idNumber",
      "address",
      "email",
      "phone",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorAlert(true);
        setAlertMessage("Vui lòng điền đầy đủ thông tin.");
        return;
      }
    }

    if (!validateEmail(formData.email)) {
      setErrorAlert(true);
      setAlertMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setErrorAlert(true);
      setAlertMessage("Vui lòng nhập số điện thoại hợp lệ từ 10 đến 12 số.");
      return;
    }

    if (!validateIDNumber(formData.idNumber)) {
      setErrorAlert(true);
      setAlertMessage("Vui lòng nhập số CCCD/CMND hợp lệ 9 số hoặc 12 kí tự.");
      return;
    }

    const formattedFormData = {
      ...formData,
      birthday: moment(formData.birthday).format("YYYY-MM-DD"),
    };
    const success = await updateCustomer(id, formattedFormData);
    if (success) {
      setSuccessAlert(true);
      setAlertMessage("Cập nhật thông tin thành công");
    } else {
      setErrorAlert(true);
      setAlertMessage("Cập nhật thông tin thất bại");
    }
  };

  return (
    <div className="flex-col justify-center items-center h-screen w-screen overflow-hidden bg-blue-200">
      <CardHeader className="text-center text-2xl mt-5">
        Chỉnh sửa thông tin khách hàng
      </CardHeader>
      {errorAlert && (
        <AlertError message={alertMessage} onClick={handleAlertClick} />
      )}
      {successAlert && (
        <AlertSuccess message={alertMessage} onClick={handleAlertClick} />
      )}
      <CardForm
        onSubmit={handleSubmit}
        className="flex justify-center items-center"
      >
        <div className="text-base font-semibold my-3">Loại khách hàng:</div>
        <select
          name="type"
          className="w-1/4 p-1 rounded-md text-center border border-zinc-400 bg-transparent hover:ring-1"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="Cá nhân">Cá nhân</option>
          <option value="Tổ chức">Tổ chức</option>
        </select>

        {formData.type === "Cá nhân" ? (
          <>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              label="Họ và tên:"
              icon={<FaUserPen />}
              required
            />
            <Input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              label="Ngày sinh:"
              icon={<FaBirthdayCake />}
              required
            />
            <Input
              type="text"
              name="idNumber"
              value={formData.idNumber}
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
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              label="Tên công ty:"
              icon={<FaBuildingUser />}
              required
            />
            <Input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              label="Ngày đăng ký:"
              icon={<MdCalendarMonth />}
              required
            />
            <Input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              label="Số ĐKKD:"
              icon={<IoCardSharp />}
              required
            />
          </>
        )}

        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          label="Địa chỉ:"
          icon={<RiMapPin2Fill />}
          required
        />
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email:"
          icon={<MdEmail />}
          required
        />
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          label="Điện thoại:"
          icon={<FaSquarePhone />}
          required
        />

        <div className="w-full flex justify-evenly items-center m-4">
          <button
            variant="secondary"
            className="text-black border p-2 hover:bg-green-400 rounded bg-green-200 border-zinc-400 hover:ring-1"
            type="submit"
          >
            Cập nhật thông tin
          </button>

          <Link
            to="/customerlist"
            className="text-black hover:text-blue-700 w-fit text-sm font-semibold hover:underline"
          >
            Danh sách khách hàng
          </Link>
        </div>
      </CardForm>
    </div>
  );
}

export default EditCustomer;
