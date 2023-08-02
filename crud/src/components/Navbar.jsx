import React, { useState } from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-lime-400 p-10 flex justify-center items-center  h-11 dark:bg-gray-900  w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <h1 className="text-blue-700 font-extrabold text-3xl flex justify-center items-center">
          React-CRUD
        </h1>
      </nav>
    </div>
  );
};

export default Navbar;
