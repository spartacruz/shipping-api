const db = require('../config/db');

const Shipment = {
    create: (userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber, calculatedRate, callback) => {
        const sql = `
      INSERT INTO Shipments (
        userId, origin, destination, weight, service,
        recipientName, recipientPhone, recipientEmail, trackingNumber, calculatedRate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.run(sql, [userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber, calculatedRate], function (err) {
            if (err) {
                console.error("Error inserting shipment:", err);
                return callback(err);
            }
            callback(null, { id: this.lastID, trackingNumber });
        });
    },

    //To count shipments created on the same day
    getDailyCount: (todayDate, callback) => {
        const sql = "SELECT COUNT(*) as count FROM Shipments WHERE trackingNumber LIKE ?";
        db.get(sql, [`AWB${todayDate}%`], (err, row) => {
            if (err) {
                console.error("Error counting daily shipments:", err);
                return callback(err);
            }
            callback(null, row.count);
        });
    }
};

module.exports = Shipment;
