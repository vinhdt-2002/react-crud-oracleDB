import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

const AlertSuccess = ({ message, onClick }) => {
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (!initialRender) {
      const timer = setTimeout(() => {
        onClick();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setInitialRender(false);
    }
  }, [onClick, initialRender]);

  return (
    <>
      <div className="absolute top-5 right-5 bg-green-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center max-w-lg cursor-pointer">
        <IoIosClose className="absolute top-1 right-1" onClick={onClick} />

        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <span className="text-green-800 text-sm font-semibold">{message}</span>
      </div>
    </>
  );
};

const AlertError = ({ message, onClick }) => {
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (!initialRender) {
      const timer = setTimeout(() => {
        onClick();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setInitialRender(false);
    }
  }, [onClick, initialRender]);

  return (
    <>
      <div className="absolute top-5 right-5 bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center max-w-lg cursor-pointer">
        <IoIosClose className="absolute top-1 right-1" onClick={onClick} />

        <svg
          viewBox="0 0 24 24"
          className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
        >
          <path
            fill="currentColor"
            d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
          ></path>
        </svg>
        <span className="text-red-800 text-sm font-semibold">{message}</span>
      </div>
    </>
  );
};

export { AlertError, AlertSuccess };
