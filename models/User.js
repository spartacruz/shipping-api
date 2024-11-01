const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Method to find a user by email
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err);
      }
      callback(null, row); // row contains user details, including hashed password
    });
  },

  // Method to create a new user with hashed password
  create: (email, hashedPassword, callback) => {
    const sql = "INSERT INTO Users (email, password) VALUES (?, ?)";
    db.run(sql, [email, hashedPassword], function(err) {
      if (err) {
        console.error("Error inserting user:", err);
        return callback(err);
      }
      callback(null, { id: this.lastID, email });
    });
  }
};

module.exports = User;