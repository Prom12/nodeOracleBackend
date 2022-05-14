import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "SHIPMENTMETHOD";
///////////////////////////routes///////////
export function getAllShipmentMethods(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getShipmentMethod(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertShipmentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(new Buffer.from(payload.shipmentMethod));

    insertShipmentMethod(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

export function UpdateShipmentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updateShipmentMethod(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeleteShipmentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deleteShipmentMethod(res, tableName, id, payload);
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
async function insertShipmentMethod(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `INSERT INTO ${tableName} VALUES (:0, :1)`,
      [id, payload.shipmentMethod],
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
async function updateShipmentMethod(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `UPDATE ${tableName} SET 
      SHIPMENTMETHOD = :0, 
       WHERE ${tableName}NO = :1`,
      [payload.shipmentMethod, payload.id],
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
async function deleteShipmentMethod(res, tableName, id, payload) {
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
