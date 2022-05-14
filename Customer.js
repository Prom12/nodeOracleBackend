import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "CUSTOMER";
///////////////////////////routes///////////
export function getAllCustomers(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getCustomer(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertCustomer(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(
      new Buffer.from(payload.name + payload.street + payload.dateOB)
    );

    insertCustomer(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

export function UpdateCustomer(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updateCustomer(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeleteCustomer(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deleteCustomer(res, tableName, id, payload);
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
async function insertCustomer(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `INSERT INTO ${tableName} VALUES (:0, :1,:2, :3, :4,:5, :6, :7, :8, :9,:10)`,
      [
        id,
        payload.name,
        payload.street,
        payload.city,
        payload.state,
        payload.zipCode,
        payload.telNo,
        payload.faxNo,
        payload.dateOB,
        payload.maritalStatus,
        payload.creditRating,
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

// Update function for adding to any table
async function updateCustomer(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `UPDATE ${tableName} SET 
      NAME = :0, 
      STREET = :1, 
      CITY = :2, 
      STATE =:3,
      ZIPCODE = :4,
      TELNO = :5,
      FAXNO =:6,
      DATEOB= :7,
      MARITALSTATUS = :8,
      CREDITRATING = :9,
       WHERE ${tableName}NO = :10`,
      [
        payload.name,
        payload.street,
        payload.city,
        payload.state,
        payload.zipCode,
        payload.telNo,
        payload.faxNo,
        new Date(),
        payload.maritalStatus,
        payload.creditRating,
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
async function deleteCustomer(res, tableName, id, payload) {
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
