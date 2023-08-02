import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase-config";
import EmployeeData from "../firebase/crudservices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router";
const AddEmployee = () => {
  const location = useLocation();
  const id = location?.state;

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [workHours, setWorkHours] = useState(undefined);
  const [salaryType, setSalaryType] = useState("Hourly");
  const [salary, setSalary] = useState(undefined);
  const [totalSalary, setTotalSalary] = useState(undefined);
  const [imgUrl, setImgUrl] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState(undefined);
  const departments = [];
  let urlOfImage = "";

  const handleDepatment = (e) => {
    if (departments.includes(e.target.value)) {
      toast.error("Only one employee at one dept.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      setDepartment("");
    } else {
      departments.push(e.target.value);
      setDepartment(e.target.value);
    }
  };
  useEffect(() => {
    if (salaryType == "Hourly") setTotalSalary(workHours * salary);
    else {
      if (workHours >= 100) setTotalSalary(salary);
      else setTotalSalary(salary * 0.75);
    }
  }, [salary, workHours, salaryType]);

  //if it is in editing mode then prefill values
  const editHandler = async (id) => {
    try {
      const docSnap = await EmployeeData.getEmployee(id);
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setEmail(docSnap.data().email);
      setWorkHours(docSnap.data().workHours);
      setSalaryType(docSnap.data().salaryType);
      setSalary(docSnap.data().salary);
      setTotalSalary(docSnap.data().totalSalary);
      setImgUrl(docSnap.data().urlOfImage);
      setDepartment(docSnap.data().department);
      setPhone(docSnap.data().phone);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("useefect");
    if (id !== undefined && id !== "") {
      {
        editHandler(id);
      }
    }
  }, [id]);

  const handleImgURL = (e) => {
    // const url = URL.createObjectURL(e.target.files[0]);
    setImgUrl(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //ref is a firebase storage function which takes storage the one which we created in firebase.config,to create unique id with date
      const storageRef = ref(storage, `Images/${Date.now()}-${imgUrl.name}`);
      //uploadBytesResumable is also a firebase storage function which takes stored reference and there storing the imageFile uploaded by owner

      const uploadTask = uploadBytesResumable(storageRef, imgUrl);
      //snapshot gives the metadata of the image uploaded
      const snapshot = await uploadTask;
      //getDownloadURL will fetch the url given by the firebase storage from the snapshot ref where info is there
      const downloadURL = await getDownloadURL(snapshot.ref);

      urlOfImage = downloadURL;
    } catch (error) {
      toast.error("Error while uploading image to database", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }

    const employeeInfo = {
      firstName,
      lastName,
      email,
      phone,
      urlOfImage,
      workHours,
      salary,
      totalSalary,
      department,
      salaryType,
    };

    //if id is present then got for editing employee
    if (id && id !== null) {
      try {
        toast.success("Editing details please wait", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        await EmployeeData.updateEmployee(id, employeeInfo);

        navigate("/");
      } catch (err) {
        console.log("edit", err);
        toast.error("Error while editing", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    }
    //else go for adding new employee
    else {
      try {
        toast.success("Adding employee please wait", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        await EmployeeData.addEmployee(employeeInfo);
        setFirstName("");
        setLastName("");
        setEmail("");
        setWorkHours(undefined);
        setSalaryType("Hourly");
        setSalary(undefined);
        setTotalSalary(undefined);
        setImgUrl("");
        setDepartment("");
        setPhone(undefined);
        navigate("/");
      } catch (err) {
        console.log("add", err);
        toast.error("Error while adding", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className=" fixed flex justify-center items-center z-50   w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mb-4"
      >
        <div className="  relative w-full max-w-2xl max-h-full ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <form
              className="p-4 border-2 border-black rounded-lg"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="file"
                  name="floating_last_name"
                  pattern="[A-Za-z]+"
                  id="floating_last_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 pb-6 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  accept="image/*"
                  onChange={(e) => handleImgURL(e)}
                />
                <label
                  htmlFor="floating_last_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Profile Image
                </label>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    pattern="[A-Za-z]+"
                    name="floating_first_name"
                    id="floating_first_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer  "
                    placeholder=" "
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={(e) =>
                      e.target.setAttribute(
                        "placeholder",
                        "Please enter your First Name"
                      )
                    }
                    onBlur={(e) => e.target.setAttribute("placeholder", "")}
                  />
                  <label
                    htmlFor="floating_first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    pattern="[A-Za-z]+"
                    id="floating_last_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={(e) =>
                      e.target.setAttribute(
                        "placeholder",
                        "Please enter your Surname"
                      )
                    }
                    onBlur={(e) => e.target.setAttribute("placeholder", "")}
                  />
                  <label
                    htmlFor="floating_last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last name
                  </label>
                </div>
              </div>

              <div className="relative z-0 w-full mb-6 group ">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) =>
                    e.target.setAttribute("placeholder", "ex. abc@gmail.com")
                  }
                  onBlur={(e) => e.target.setAttribute("placeholder", "")}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  min="1"
                  name="floating_first_name"
                  id="floating_first_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  onFocus={(e) =>
                    e.target.setAttribute(
                      "placeholder",
                      "Working hrs in numbers only"
                    )
                  }
                  onBlur={(e) => e.target.setAttribute("placeholder", "")}
                />
                <label
                  htmlFor="floating_first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Work Hours
                </label>
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <label
                  htmlFor="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Salary Type
                </label>
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setSalaryType(e.target.value)}
                >
                  <option>Hourly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  min={salaryType === "Hourly" ? "500" : "15000"}
                  name="floating_first_name"
                  id="floating_first_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  onFocus={(e) =>
                    e.target.setAttribute(
                      "placeholder",
                      "Salary in numbers only"
                    )
                  }
                  onBlur={(e) => e.target.setAttribute("placeholder", "")}
                />
                <label
                  htmlFor="floating_first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Salary
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                Total Salary: {totalSalary}
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="tel"
                    pattern="[789]\d{9}"
                    name="floating_phone"
                    id="floating_phone"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={(e) =>
                      e.target.setAttribute(
                        "placeholder",
                        "Indian numbers only"
                      )
                    }
                    onBlur={(e) => e.target.setAttribute("placeholder", "")}
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Phone number (+91 )
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    pattern="[a-zA-Z]+"
                    name="floating_company"
                    id="floating_company"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    onFocus={(e) =>
                      e.target.setAttribute(
                        "placeholder",
                        "ex. React JS Developer"
                      )
                    }
                    onBlur={(e) => e.target.setAttribute("placeholder", "")}
                    required
                    value={department}
                    onChange={(e) => handleDepatment(e)}
                  />
                  <label
                    htmlFor="floating_company"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Department
                  </label>
                </div>
              </div>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
                <button
                  data-modal-hide="staticModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
