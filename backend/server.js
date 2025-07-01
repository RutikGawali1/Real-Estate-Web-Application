const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/auth/properties', propertyRoutes);
app.use('/api/cloudinary', require('./routes/cloudinary'));


app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});