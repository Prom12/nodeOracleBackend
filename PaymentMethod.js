import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "PAYMENTMETHOD";

///////////////////////////routes///////////
export function getAllPaymentMethods(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getPaymentMethod(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertPaymentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(new Buffer.from(payload.paymentmethod));
    let procedure = "INSERT";
    insertPaymentMethod(res, tableName, id, payload, procedure);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

export function UpdatePaymentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updatePaymentMethod(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeletePaymentMethod(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deletePaymentMethod(res, tableName, id, payload);
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
async function insertPaymentMethod(res, tableName, id, payload, procedure) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `exec ${procedure}PAYMENTMETHOD @PAYMENTMETHODNO = :0,@PAYMENTMETHOD = :1`[
        (id, payload.paymentMethod)
      ],
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

// Insert function for adding to any table
async function updatePaymentMethod(res, tableName, id, payload, procedure) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `exec ${procedure}PAYMENTMETHOD @PAYMENTMETHODNO = :0,@PAYMENTMETHOD = :1`[
        (id, payload.paymentMethod)
      ],
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

// Insert function for adding to any table
async function deletePaymentMethod(res, tableName, id, payload, procedure) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `exec ${procedure}PAYMENTMETHOD @PAYMENTMETHODNO = :0,@PAYMENTMETHOD = :1`[
        (id, payload.paymentMethod)
      ],
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
