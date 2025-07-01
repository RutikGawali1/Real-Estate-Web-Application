// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use('/api/auth', authRoutes);
app.use('/api/auth/properties', propertyRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => console.log('Server running on port 5000'));