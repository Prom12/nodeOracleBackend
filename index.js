import express from "express";
import oracledb from "oracledb";
import cors from "cors";

const app = express();

const port = 3000;
var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let result;

// Middle Ware
app.use(cors());
app.use(express.json());

// Listening For request from Server
app.listen(port, () =>
  console.log("node Oracle RestApi app listening on port %s!", port)
);

// Functions with Connection
async function selectAll(req, res, table) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });

    console.log("connected to database");
    // run query to get all
    result = await connection.execute(`SELECT * FROM ${table}`);
  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log("close connection success");
      } catch (err) {
        console.error(err.message);
      }
    }
    if (result.rows.length == 0) {
      //query return zero
      return res.send(`There is no data in ${table} table`);
    } else {
      //send all
      return res.send(result.rows);
    }
  }
}

async function selectEmployeesById(req, res, id) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    // run query to get employee with employee_id
    result = await connection.execute(
      `SELECT * FROM employees where employee_id=:id`,
      [id]
    );
  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
      } catch (err) {
        return console.error(err.message);
      }
    }
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send("query send no rows");
    } else {
      //send all employees
      return res.send(result.rows);
    }
  }
}

//Urls that call connection

//get all employees
app.get("/employees", function (req, res) {
  let table = "EMPLOYEE";
  selectAll(req, res, table);
});

//get all employees
app.get("/customers", function (req, res) {
  let table = "CUSTOMER";
  selectAll(req, res, table);
});

//get employee?id=<id employee>
app.get("/employee", function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    res.send("Query param id is not number");
    return;
  }
  selectEmployeesById(req, res, id);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
