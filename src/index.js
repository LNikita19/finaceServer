require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Already imported
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./Routes/authRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');

const app = express();


const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://finace-server.vercel.app',
  'http://localhost:3000',
  'https://finance-user.vercel.app' // ✅ add this
];
// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true // Important if you're sending cookies or authorization headers
}));

// Other Middleware (keep this order - CORS before other middleware that might process requests)
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); // Parses JSON bodies
app.use(cookieParser()); // Parses cookies


app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);


// Error handling middleware (should be placed after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection
mongoose
  .connect(
    "mongodb+srv://qjoxqciedfjvrzyeyh:oVDaqdgLGKDxYT58@cluster0.kczadan.mongodb.net/finance-tracker",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));


app.listen(process.env.PORT || 5000, function () {
  console.log("Express app running on port " + (process.env.PORT || 5000));
});