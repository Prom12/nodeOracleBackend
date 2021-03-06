import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "EMPLOYEE";

///////////////////////////routes///////////
export function getAllEmployees(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getEmployee(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertEmployee(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(
      new Buffer.from(
        payload.title +
          payload.firstName +
          payload.middleName +
          payload.socialSecurity +
          payload.sex
      )
    );

    insertEmployee(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function UpdateEmployee(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updateEmployee(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeleteEmployee(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deleteEmployee(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
////////////////////// Functions/////////////////
async function select(res, execution) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    console.log("connected to database");
    await connection.execute(execution, function (err, result) {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        if (result.rows.length == 0) {
          //query return zero
          console.log(result);
          return res.send([]);
        } else {
          //send all
          return res.send(result.rows);
        }
      }
    });
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
  }
}

// Insert function for adding to any table
async function insertEmployee(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `INSERT INTO ${tableName} VALUES (:0, :1,:2, :3, :4,:5, :6, :7, :8, :9,:10, :11, :12, :13, :14)`,
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
      function (err) {
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

// Update function for adding to any table
async function updateEmployee(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `UPDATE ${tableName} SET 
      TITLE = :0, 
      FIRSTNAME = :1, 
      MIDDLENAME = :2, 
      LASTNAME =:3,
      ADDRESS = :4,
      WORKTELNO = :5,
      HOMETELNO =:6,
      EMPEMAILADDRESS= :7,
      SOCIALSECURITY = :8,
      DATEOB = :9,
      POSITION = :10,
      SEX = :11,
      SALARY = :12, 
      DATESTARTED = :13 WHERE EMPLOYEENO = :14`,
      [
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
        payload.id,
      ],
      { autoCommit: true },
      function (err) {
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

// Delete function for adding to any table
async function deleteEmployee(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `DELETE FROM ${tableName} WHERE ${tableName}NO = :1`,
      [payload.id],
      { autoCommit: true },
      function (err) {
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
