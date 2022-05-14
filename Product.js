import oracledb from "oracledb";
import farmhash from "farmhash";

var password = "prom";
var user = "c##prom";
var connectionString = "localhost/orcl";
let connection;
let tableName = "PRODUCT";

///////////////////////////routes///////////
export function getAllProducts(req, res) {
  select(res, `SELECT * FROM ${tableName}`);
}

export function getProduct(req, res) {
  select(
    res,
    `SELECT * FROM ${tableName} where ${tableName}NO= '${req.params.id}'`
  );
}

export function InsertProduct(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    let id = farmhash.hash64(
      new Buffer.from(
        payload.productName + payload.serialNo + payload.unitPrice
      )
    );

    insertProduct(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function UpdateProduct(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    updateProduct(res, tableName, id, payload);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
export function DeleteProduct(req, res) {
  try {
    var { payload } = [];
    payload = req.body;

    deleteProduct(res, tableName, id, payload);
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
async function insertProduct(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `INSERT INTO ${tableName} VALUES (:0, :1,:2, :3, :4,:5, :6)`,
      [
        id,
        payload.productName,
        payload.serial,
        payload.unitPrice,
        payload.quantityOnHand,
        payload.reorderLevel,
        payload.reorderLeadTime,
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
async function updateProduct(res, tableName, id, payload) {
  try {
    connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectionString,
    });
    result = await connection.execute(
      `UPDATE ${tableName} SET 
      PRODUCTNAME = :0, 
      SERIALNO = :1, 
      UNITPRICE = :2, 
      QUANTITYONHAND =:3,
      REORDERLEVEL = :4,
      REORDERQUANTITY = :5,
      REORDERLEADTIME =:6,
      WHERE ${tableName}NO = :7`,
      [
        payload.productName,
        payload.serial,
        payload.unitPrice,
        payload.quantityOnHand,
        payload.reorderLevel,
        payload.reorderLeadTime,
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
async function deleteProduct(res, tableName, id, payload) {
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
