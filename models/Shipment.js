const db = require('../config/db');

const Shipment = {
    create: (userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber, callback) => {
        const sql = `
      INSERT INTO Shipments (userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.run(sql, [userId, origin, destination, weight, service, recipientName, recipientPhone, recipientEmail, trackingNumber], function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID, trackingNumber });
        });
    }
};

module.exports = Shipment;