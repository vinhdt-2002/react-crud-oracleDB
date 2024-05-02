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
  const { getCustomerById, updateCustomer } = useDataContext();
  const [formData, setFormData] = useState({
    type: "Cá nhân",
    fullName: "",
    birthday: "",
    idNumber: "",
    address: "",
    email: "",
    phone: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await getCustomerById(id);
        if (customer) {
          setFormData({
            type: customer.CUSTOMER_TYPE || "Cá nhân",
            fullName: customer.NAME || "",
            // Định dạng lại ngày sử dụng moment
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
    const re = /^\d{5,10}$/;
    return re.test(idNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setAlertSuccess(false);
        setAlertMessage("Vui lòng điền đầy đủ thông tin.");
        return;
      }
    }

    if (!validateEmail(formData.email)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập số điện thoại hợp lệ từ 10 đến 12 số.");
      return;
    }

    if (!validateIDNumber(formData.idNumber)) {
      setAlertSuccess(false);
      setAlertMessage("Vui lòng nhập số CCCD/CMND hợp lệ từ 5 đến 10 số.");
      return;
    }

    const formattedFormData = {
      ...formData,
      birthday: moment(formData.birthday).format("YYYY-MM-DD"),
    };
    const success = await updateCustomer(id, formattedFormData);
    if (success) {
      setAlertSuccess(true);
      setAlertMessage("Cập nhật thông tin thành công");
    } else {
      setAlertSuccess(false);
      setAlertMessage("Cập nhật thông tin thất bại");
    }
  };

  return (
    <div className="flex-col justify-center items-center h-screen w-screen overflow-hidden bg-blue-200">
      <CardHeader className="text-center text-2xl mt-5">
        Chỉnh sửa thông tin khách hàng
      </CardHeader>
      <CardForm
        onSubmit={handleSubmit}
        className="flex justify-center items-center"
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
            className="text-black border bg-green-200 p-1 hover:bg-green-400 rounded"
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
