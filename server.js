require("dotenv").config();
require("colors");
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    })
});

app.use('/api/v1/products', require('./src/routes/productRoute'));
app.use('/api/v1/transactions', require('./src/routes/transactionRoute'));

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.APP_URL}:${PORT}`.cyan);
});
