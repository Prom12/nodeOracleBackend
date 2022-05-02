import express from "express";
import cors from "cors";

///////////////////////////////////////////
import { getAllEmployees, getEmployee, InsertEmployee } from "./Employee.js";
import { getAllCustomers, getCustomer } from "./Customer.js";

const app = express();
const port = 3000;

// Middle Ware
app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////////////
// Listening For request from Server
app.listen(port, () =>
  console.log("node Oracle RestApi app listening on port %s!", port)
);
/////////////////////////////////////////////////////////////

//Urls that call connection

//get all employees
app.get("/employees", getAllEmployees);
//get employee by ID
app.get("/employee/:id", getEmployee);

//get all customers
app.get("/customers", getAllCustomers);
//get customer by ID
app.get("/customer/:id", getCustomer);

// Post connection URLS, for adding to the database
app.post("/employee", InsertEmployee);

app.get("/", (req, res) => {
  res.send("Server is running");
});
