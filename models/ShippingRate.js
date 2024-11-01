const db = require('../config/db');

const ShippingRate = {
  findRates: (origin, destination, callback) => {
    const sql = "SELECT * FROM ShippingRates WHERE origin = ? AND destination = ?";
    db.all(sql, [origin, destination], (err, rows) => {
      if (err) {
        console.error("Error retrieving shipping rates:", err);
        return callback(err);
      }
      callback(null, rows);
    });
  },

  // To validate a specific rate by origin, destination, and service
  findRate: (origin, destination, service, callback) => {
    const sql = "SELECT * FROM ShippingRates WHERE origin = ? AND destination = ? AND service = ?";
    db.get(sql, [origin, destination, service], (err, row) => {
      if (err) {
        console.error("Error retrieving shipping rate:", err);
        return callback(err);
      }
      callback(null, row);
    });
  }
};

module.exports = ShippingRate;