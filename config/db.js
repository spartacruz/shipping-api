const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shipping.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ShippingRates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin TEXT,
      destination TEXT,
      service TEXT,
      rate REAL,
      estimated_delivery TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      origin TEXT,
      destination TEXT,
      weight REAL,
      service TEXT,
      recipientName TEXT,
      recipientPhone TEXT,
      recipientEmail TEXT,
      trackingNumber TEXT,
      FOREIGN KEY(userId) REFERENCES Users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Config (
      key TEXT PRIMARY KEY,
      value REAL
    )
  `);

  db.run("INSERT OR IGNORE INTO Config (key, value) VALUES ('maxWeight', 100)");
  db.run("INSERT OR IGNORE INTO Config (key, value) VALUES ('minWeight', 1)");

  // Insert shipping rates only if they don't already exist
  const shippingRates = [
    { origin: 'Jakarta', destination: 'Bandung', service: 'standard', rate: 10000, estimated_delivery: '3-5 business days' },
    { origin: 'Jakarta', destination: 'Bandung', service: 'express', rate: 20000, estimated_delivery: '1-2 business days' },
    { origin: 'Jakarta', destination: 'Bandung', service: 'instant', rate: 40000, estimated_delivery: '1-2 hours' },
    { origin: 'Bandung', destination: 'Jakarta', service: 'standard', rate: 10000, estimated_delivery: '3-5 business days' },
    { origin: 'Bandung', destination: 'Jakarta', service: 'express', rate: 20000, estimated_delivery: '1-2 business days' },
    { origin: 'Bandung', destination: 'Jakarta', service: 'instant', rate: 40000, estimated_delivery: '1-2 hours' },
    { origin: 'Jakarta', destination: 'Padang', service: 'standard', rate: 25000, estimated_delivery: '5-7 business days' },
    { origin: 'Jakarta', destination: 'Padang', service: 'express', rate: 50000, estimated_delivery: '2-4 business days' },
    { origin: 'Jakarta', destination: 'Padang', service: 'instant', rate: 150000, estimated_delivery: '1-2 hours' },
    { origin: 'Padang', destination: 'Jakarta', service: 'standard', rate: 25000, estimated_delivery: '5-7 business days' },
    { origin: 'Padang', destination: 'Jakarta', service: 'express', rate: 50000, estimated_delivery: '2-4 business days' },
    { origin: 'Padang', destination: 'Jakarta', service: 'instant', rate: 150000, estimated_delivery: '1-2 hours' }
  ];

  shippingRates.forEach((rate) => {
    db.get(
      "SELECT * FROM ShippingRates WHERE origin = ? AND destination = ? AND service = ?",
      [rate.origin, rate.destination, rate.service],
      (err, row) => {
        if (err) {
          console.error("Error checking existing data:", err);
        } else if (!row) {
          db.run(
            "INSERT INTO ShippingRates (origin, destination, service, rate, estimated_delivery) VALUES (?, ?, ?, ?, ?)",
            [rate.origin, rate.destination, rate.service, rate.rate, rate.estimated_delivery],
            (err) => {
              if (err) {
                console.error("Error inserting data:", err);
              } else {
                console.log(`Inserted rate: ${rate.service} from ${rate.origin} to ${rate.destination} with estimated delivery: ${rate.estimated_delivery}`);
              }
            }
          );
        } else {
          console.log(`Rate for ${rate.service} from ${rate.origin} to ${rate.destination} already exists.`);
        }
      }
    );
  });
});

module.exports = db;