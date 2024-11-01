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
    }
};

module.exports = Shipment;