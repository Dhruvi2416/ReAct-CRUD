import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav class="bg-white dark:bg-gray-900  w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-end mx-auto p-4">
          <div class="flex ">
            <button
              type="button"
              className=" flex justify-end items-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
