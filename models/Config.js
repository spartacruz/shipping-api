const db = require('../config/db');

const Config = {
  get: (key, callback) => {
    db.get("SELECT value FROM Config WHERE key = ?", [key], (err, row) => {
      if (err) {
        console.error("Error retrieving config:", err);
        return callback(err);
      }
      callback(null, row ? row.value : null);
    });
  }
};

module.exports = Config;