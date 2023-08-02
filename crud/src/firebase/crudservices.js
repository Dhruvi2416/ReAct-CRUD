import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const employeeCollectioRef = collection(db, "employees");

class EmployeeData {
  //to add data of employees in firebase
  //employeeCollectioRef - the collection of employees in db
  //addDoc collection newEmployee to add newemployees in collection
  addEmployee = (newEmployee) => {
    return addDoc(employeeCollectioRef, newEmployee);
  };

  //to update employee
  //employeeDoc will first get the id from collection to check if it exists
  //updateDoc employeeDoc whose id exists will be updated
  updateEmployee = (id, updatedEmployee) => {
    const employeeDoc = doc(db, "employees", id);
    return updateDoc(employeeDoc, updatedEmployee);
  };

  //to delete employee
  //employeeDoc will first get the id from collection to check if it exists
  //deleteDoc employeeDoc whose id exists will be deleted
  deleteEmployee = (id) => {
    const employeeDoc = doc(db, "employees", id);
    return deleteDoc(employeeDoc);
  };

  //to get latest employees list
  getAllEmployees = async () => {
    const data = await getDocs(employeeCollectioRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  // in order to update any employee we will need that old values to be populated
  getEmployee = (id) => {
    const employeeDoc = doc(db, "employees", id);
    return getDoc(employeeDoc);
  };
}

export default new EmployeeData();
