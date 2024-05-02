import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      console.log("Fetched data successfully:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Lỗi khi tải dữ liệu từ máy chủ");
    }
  };

  const getCustomerById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customers/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting customer by id:", error);
      return null;
    }
  };

  const addCustomer = async (newCustomer) => {
    try {
      console.log("Attempting to add new customer:", newCustomer);
      const response = await axios.post(
        "http://localhost:5000/api/customers",
        newCustomer
      );
      if (response.status === 201) {
        const addedCustomer = response.data;
        setData([...data, addedCustomer]);
        fetchData();
        return true;
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      }
    }
    return false;
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/customers/${id}`
      );
      if (response.status === 200) {
        setData(data.filter((customer) => customer.CUSTOMER_ID !== id));
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      }
    }
  };

  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/customers/${id}`,
        updatedCustomer
      );
      if (response.status === 200) {
        const updatedData = data.map((customer) =>
          customer.CUSTOMER_ID === id
            ? { ...customer, ...updatedCustomer }
            : customer
        );
        setData(updatedData);
        fetchData();
        return true;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      }
    }
    return false;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        error,
        fetchData,
        addCustomer,
        deleteCustomer,
        updateCustomer,
        getCustomerById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataContext;
