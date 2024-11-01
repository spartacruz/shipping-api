const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const shippingRoutes = require('./routes/shippingRoutes');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/v1', authRoutes);
app.use('/api/v1/shipping', shippingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));