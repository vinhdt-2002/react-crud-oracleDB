import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddCustomer from "./viewpages/AddCustomer";
import CustomerList from "./viewpages/CustomerList";
import EditCustomer from "./viewpages/EditCustomer";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customerlist" element={<CustomerList />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/edit-customer/:id" element={<EditCustomer />} />
      </Routes>
    </BrowserRouter>
  );
}
