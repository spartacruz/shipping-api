const db = require('../config/db');

const ShippingRate = {
    findRates: (origin, destination, callback) => {
        const sql = "SELECT * FROM ShippingRates WHERE origin = ? AND destination = ?";
        db.all(sql, [origin, destination], (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    }
};

module.exports = ShippingRate;