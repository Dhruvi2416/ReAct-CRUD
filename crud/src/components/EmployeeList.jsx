import React, { useState, useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router";
import EmployeeData from "../firebase/crudservices";
const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);

  const navigate = useNavigate();
  //fetch all empployees data
  const fetchData = async () => {
    await EmployeeData.getAllEmployees().then((data) => {
      setEmployeeList(data);
    });
  };
  console.log(employeeList);
  useEffect(() => {
    fetchData();
  }, []);

  //handling fetching employee detail with id
  const handleGetEmployee = async (id) => {
    navigate(`/edit/${id}`, { state: id });
    console.log(id);
  };

  //handling delete employee through id

  const handleDeleteEmployee = async (id) => {
    const deleteYes = window.confirm(
      "Are you sure you want to remove the employee?"
    );
    if (deleteYes) {
      await EmployeeData.deleteEmployee(id);
      fetchData();
    }
  };
  return (
    <div>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-end mx-auto p-4">
        <button
          data-modal-target="staticModal"
          data-modal-toggle="staticModal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={() => navigate("/addEmployee")}
        >
          Add Employee
        </button>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {" "}
            <tr>
              <th scope="col" className="px-6 py-3">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Salary Type
              </th>
              <th scope="col" className="px-6 py-3">
                Salary
              </th>
              <th scope="col" className="px-6 py-3">
                Work hours
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee, id) => (
              <tr
                key={id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={employee.urlOfImage}
                    alt="Jese image"
                  />
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      {employee.firstName + " " + employee.lastName}
                    </div>
                    <div className="font-normal pr-4 text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.salaryType}</td>
                <td className="px-6 py-4">{employee.totalSalary}</td>
                <td className="px-6 py-4">{employee.workHours}</td>
                <td className="px-6 py-4">{employee.phone}</td>
                <td className=" px-6 py-4 space-x-2  xl:space-x-3">
                  <button
                    onClick={() => handleGetEmployee(employee.id)}
                    className=" font-medium text-lg xl:text-xl  text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="font-medium text-lg xl:text-xl text-red-600 dark:text-red-500 hover:underline"
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
