import React from "react";
import EmployeeList from "./components/EmployeeList";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddEmployee from "./components/AddEmployee";
const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/addEmployee" element={<AddEmployee />} />
          <Route path="/edit/:id" element={<AddEmployee />} />
          <Route path="/" element={<EmployeeList />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
