// import connection
import db from "../config/database.js";
// import connection
import mongoose from "mongoose";

// define BillStatus schema
const billStatusSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  bill_id: {
    type: String,
  },
  bill_total: {
    type: Number,
    required: true,
  },
  bill_status: {
    type: Number,
    default: 0,
  },
  bill_paid: {
    type: Boolean,
    default: false,
  },
});

// create BillStatus model
const BillStatus = mongoose.model("BillStatus", billStatusSchema);

export const getNewestId = (result) => {
  db.query("SELECT bill_id FROM billstatus ORDER BY bill_id DESC LIMIT 0, 1", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    }
    else {
      result(null, results[0]);
    }
  });
};
export const insertBillStatusMySQL = (data, result) => {
  db.query("INSERT INTO billstatus SET ?", data, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};

// insert Bill Status into MongoDB
export const insertBillStatusMongoDB = async (data, result) => {
  try {
    const newBillStatus = await BillStatus.create(data);
    result(null, newBillStatus);
  } catch (err) {
    console.log(err);
    result(err, null);
  }
};

// create Bill Status
export const createBillStatus = (req, res) => {
  const data = req.body;
  insertBillStatusMySQL(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      insertBillStatusMongoDB(data, (err, results) => {
        if (err) {
          res.send(err);
        } else {
          res.json(results);
        }
      });
    }
  });
};

// insert Bill Details into MySQL
export const insertBillDetailsMySQL = (data, result) => {
  db.query("INSERT INTO billdetails SET ?", data, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};

// create Bill
export const createBill = (req, res) => {
  const data = req.body;
  insertBillDetailsMySQL(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
// get all Bills Status
export const getBillsByUser = (id, result) => {
  db.query("SELECT * FROM billstatus WHERE user_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    }
    else {
      result(null, results);
    }
  });
};

// get all Bills Status
export const getBillsByBill = (id, result) => {
  db.query("SELECT * FROM billstatus WHERE bill_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    }
    else {
      result(null, results);
    }
  });
};



// get all Bills Status
export const getAll = (result) => {
  db.query("SELECT * FROM billstatus", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    }
    else {
      result(null, results);
    }
  });
};

export const updateStatus = (id, result) => {
  db.query("UPDATE billstatus SET bill_status = bill_status + 1  WHERE bill_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};
// update Bill Status to paid
export const updatePaid = (id, result) => {
  db.query("UPDATE billstatus SET bill_paid = 'true' WHERE bill_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};



export const cancelStatus = (id, result) => {
  db.query("UPDATE billstatus SET bill_status = 0  WHERE bill_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
  db.query("UPDATE billstatus SET bill_paid = 'false' WHERE bill_id = ?", id, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    }
  });
};


// update Bill Status to cancelled
export const cancelBillStatus = async (id, result) => {
  try {
    const updatedBillStatus = await BillStatus.findByIdAndUpdate(id, { bill_status: 0, bill_paid: false }, { new: true });
    result(null, updatedBillStatus);
  } catch (err) {
    console.log(err);
    result(err, null);
  }
};


