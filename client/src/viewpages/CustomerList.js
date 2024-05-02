import { CardHeader } from "components/ui/card";
import ReuseDialog from "components/ui/reuseDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDataContext } from "../api/DataContext";

function CustomerList() {
  const { data: customers, deleteCustomer, fetchData } = useDataContext();
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    if (customers && customers.length >= 0) {
      setCustomerList(customers);
    }
  }, [customers]);

  const handleDelete = async (id) => {
    console.log("Deleting customer with ID:", id);
    await deleteCustomer(id);
    fetchData();
  };

  return (
    <div className="p-2 h-screen w-screen overflow-x-hidden bg-blue-50">
      <CardHeader className="text-3xl text-center">
        Danh sách khách hàng
      </CardHeader>
      <Link
        to="/add-customer"
        className="text-black bg-green-200 border border-zinc-400 hover:bg-green-400 px-4 py-2 rounded"
      >
        Thêm khách hàng mới
      </Link>

      <Table className="mt-4">
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Ngày sinh/Thành lập</TableHead>
            <TableHead>Số CMND/CCCD/ĐKKD</TableHead>
            <TableHead>Địa chỉ/Địa chỉ ĐKKD</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Tùy chỉnh</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerList.map((customer) => (
            <TableRow key={customer.CUSTOMER_ID}>
              <TableCell className="text-center">
                {customer.CUSTOMER_ID}
              </TableCell>
              <TableCell className="text-left">
                {customer.CUSTOMER_TYPE}
              </TableCell>
              <TableCell className="text-left">{customer.NAME}</TableCell>
              <TableCell className="text-right">
                {customer.REGISTRATION_DATE
                  ? new Date(customer.REGISTRATION_DATE).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell className="text-right">{customer.ID_NUMBER}</TableCell>
              <TableCell className="text-left">{customer.ADDRESS}</TableCell>
              <TableCell className="text-left">{customer.EMAIL}</TableCell>
              <TableCell className="text-right">{customer.PHONE}</TableCell>
              <TableCell className="text-center">
                <ReuseDialog
                  header=" Bạn có chắc chắn muốn xóa khách hàng này chứ ?"
                  des="Đây là hành động không thể quay lại, vui lòng chọn:"
                  handleClick={() => handleDelete(customer.CUSTOMER_ID)}
                  button_action={
                    <div className="bg-red-500 text-white px-4 py-2 m-1 rounded hover:ring-2 my-1">
                      Xóa
                    </div>
                  }
                  button_submit="Xóa"
                ></ReuseDialog>
                <Link to={`/edit-customer/${customer.CUSTOMER_ID}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:ring-2 my-1 m-1">
                    Sửa
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Outlet />
    </div>
  );
}

export default CustomerList;
