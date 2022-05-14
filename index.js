import express from "express";
import cors from "cors";

///////////////////////////////////////////
import {
  getAllCustomers,
  getCustomer,
  InsertCustomer,
  UpdateCustomer,
  DeleteCustomer,
} from "./Customer.js";
import {
  getAllEmployees,
  getEmployee,
  InsertEmployee,
  UpdateEmployee,
  DeleteEmployee,
} from "./Employee.js";
import {
  getAllInvoices,
  getInvoice,
  InsertInvoice,
  UpdateInvoice,
  DeleteInvoice,
} from "./Invoice.js";
import {
  getAllOrders,
  getOrder,
  InsertOrder,
  UpdateOrder,
  DeleteOrder,
} from "./Order.js";
import {
  getAllOrderDetails,
  getOrderDetail,
  InsertOrderDetail,
  UpdateOrderDetail,
  DeleteOrderDetail,
} from "./OrderDetail.js";
import {
  getAllPaymentMethods,
  getPaymentMethod,
  InsertPaymentMethod,
  UpdatePaymentMethod,
  DeletePaymentMethod,
} from "./PaymentMethod.js";
import {
  getAllProducts,
  getProduct,
  InsertProduct,
  UpdateProduct,
  DeleteProduct,
} from "./Product.js";
import {
  getAllShipments,
  getShipment,
  InsertShipment,
  UpdateShipment,
  DeleteShipment,
} from "./Shipment.js";
import {
  getAllShipmentMethods,
  getShipmentMethod,
  InsertShipmentMethod,
  UpdateShipmentMethod,
  DeleteShipmentMethod,
} from "./ShipmentMethod.js";

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
//get all customers
app.get("/customers", getAllCustomers);
//get customer by ID
app.get("/customer/:id", getCustomer);

//get all employees
app.get("/employees", getAllEmployees);
//get employee by ID
app.get("/employee/:id", getEmployee);

//get all Invoice
app.get("/invoices", getAllInvoices);
//get customer by ID
app.get("/invoice/:id", getInvoice);

//get all Order
app.get("/orders", getAllOrders);
//get customer by ID
app.get("/order/:id", getOrder);

//get all OrderDetail
app.get("/orderDetails", getAllOrderDetails);
//get customer by ID
app.get("/orderDetail/:id", getOrderDetail);

//get all PaymentMethod
app.get("/paymentMethods", getAllPaymentMethods);
//get customer by ID
app.get("/paymentMethod/:id", getPaymentMethod);

//get all Product
app.get("/products", getAllProducts);
//get customer by ID
app.get("/product/:id", getProduct);

//get all Shipment
app.get("/shipments", getAllShipments);
//get customer by ID
app.get("/shipment/:id", getShipment);

//get all ShipmentMethod
app.get("/shipmentMethods", getAllShipmentMethods);
//get customer by ID
app.get("/shipmentMethod/:id", getShipmentMethod);

///////////////////////////////////////////////////
// Post connection URLS, for adding to the database
app.post("/customer", InsertCustomer);
app.post("/employee", InsertEmployee);
app.post("/invoice", InsertInvoice);
app.post("/order", InsertOrder);
app.post("/orderDetail", InsertOrderDetail);
app.post("/paymentMethod", InsertPaymentMethod);
app.post("/shipment", InsertShipment);
app.post("/shipmentMethod", InsertShipmentMethod);

// Post connection URLS, for Editing to the database
app.post("/update_customer", UpdateCustomer);
app.post("/update_employee", UpdateEmployee);
app.post("/update_invoice", UpdateInvoice);
app.post("/update_order", UpdateOrder);
app.post("/update_orderDetail", UpdateOrderDetail);
app.post("/update_paymentMethod", UpdatePaymentMethod);
app.post("/update_shipment", UpdateShipment);
app.post("/update_shipmentMethod", UpdateShipmentMethod);

// Post connection URLS, for Deleting to the database
app.post("/delete_customer", DeleteCustomer);
app.post("/delete_employee", DeleteEmployee);
app.post("/delete_invoice", DeleteInvoice);
app.post("/delete_order", DeleteOrder);
app.post("/delete_orderDetail", DeleteOrderDetail);
app.post("/delete_paymentMethod", DeletePaymentMethod);
app.post("/delete_shipment", DeleteShipment);
app.post("/delete_shipmentMethod", DeleteShipmentMethod);

app.get("/", (req, res) => {
  res.send("Server is running");
});
