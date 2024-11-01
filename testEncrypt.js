const bcrypt = require('bcryptjs');
const plainPassword = "inipassword";
const hashedPassword = bcrypt.hashSync(plainPassword, 10);

console.log("Plain password:", plainPassword);
console.log("Hashed password:", hashedPassword);
console.log("Password matches:", bcrypt.compareSync(plainPassword, hashedPassword));