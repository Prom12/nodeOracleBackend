import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import farmhash from "farmhash";

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
      `SELECT * FROM EMPLOYEE where EMPLOYEEID=:id`,
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

// Insert function for adding to any table
async function insertEmployee(req, res, tableName, tableData, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });

    // tableData
    // run query to get employee with employee_id
    // result = await connection.execute(
    //   `INSERT INTO EMPLOYEE VALUES (${id}, ${tableData})`
    // );

    result = await connection.execute(
      `INSERT INTO EMPLOYEE VALUES (:0, :1,:2, :3, :4,:5, :6, :7, :8, :9,:10, :11, :12, :13, :14)`,
      [
        id,
        payload.title,
        payload.firstName,
        payload.middleName,
        payload.lastName,
        payload.address,
        payload.workTelNo,
        payload.homeTelNo,
        payload.employerAddress,
        payload.socialSecurity,
        new Date(),
        payload.position,
        payload.sex,
        payload.salary,
        new Date(),
      ],
      { autoCommit: true },
      function (err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.send("Data Successfully Saved");
        }
      }
    );
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
        return console.error(err.message);
      }
    }
  }
}

// Post connection URLS, for adding to the database

app.post("/newEmployee", function (req, res) {
  console.log(req.body);
  // console.log(res);
  try {
    var { payload } = [];
    payload = req.body;

    const employeeNo = farmhash.hash64(
      new Buffer.from(
        payload.title +
          payload.firstName +
          payload.middleName +
          payload.socialSecurity +
          payload.sex
      )
    );
    console.log("employeeNo");
    console.log(employeeNo);

    let tableName = "EMPLOYEE";
    let tableData = payload;
    let id = employeeNo;

    insertEmployee(req, res, tableName, tableData, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.post("/newCustomer", async function (req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    const customerNo = farmhash.hash64(
      new Buffer.from(
        payload.zipCode +
          payload.name +
          payload.state +
          payload.telNumber +
          payload.maritalStatus
      )
    );

    let tableName = "CUSTOMER";
    let tableData = payload;
    let id = customerNo;

    insertEmployee(req, res, tableName, tableData, id);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});
