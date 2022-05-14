import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "SHIPMENT";
///////////////////////////routes///////////
export function getAllShipments(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getShipment(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertShipment(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(
      new Buffer.from(payload.quantity + payload.shipmentDate)
    );

    insertShipment(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

export function UpdateShipment(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updateShipment(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeleteShipment(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deleteShipment(res, tableName, id, payload);
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
async function insertShipment(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `INSERT INTO ${tableName} VALUES (:0, :1,:2, :3,:4,:5,:6,:7)`,
      [
        id,
        payload.quantity,
        new Date(),
        payload.completeStatus,
        payload.orderNo,
        payload.productNo,
        payload.employeeNo,
        payload.sMethodNo,
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
async function updateShipment(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `UPDATE ${tableName} SET 
      QUANTITY = :0, 
      SHIPMENTDATE = :1, 
      COMPLETESTATUS = :2, 
      ORDERNO =:3,
      PRODUCTNO = :4,
      EMPLOYEENO = :5,
      SMETHODNO = :6,
       WHERE ${tableName}NO = :7`,
      [
        payload.quantity,
        new Date(),
        payload.completeStatus,
        payload.orderNo,
        payload.productNo,
        payload.employeeNo,
        payload.sMethodNo,
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
async function deleteShipment(res, tableName, id, payload) {
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
