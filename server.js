const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com', // Change this to your MySQL host
  user: 'sql12671147',      // Change this to your MySQL username
  password: 'vnc2TZ1T4f',      // Change this to your MySQL password
  database: 'sql12671147',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// API endpoint to handle form submissions
app.post('/submitForm', (req, res) => {
  try {
    // Extract user data from the request body
    const userData = req.body;

    // Validate user data (you can customize this based on your requirements)
    if (!userData.name || !userData.age || !userData.gender || !userData.phoneNumber || !userData.emailAddress || !userData.batch) {
      throw new Error('Incomplete user data. Please fill in all the fields.');
    }

    // Perform basic age validation
    const age = parseInt(userData.age, 10);
    if (isNaN(age) || age < 18 || age > 65) {
      throw new Error('Invalid age. Age must be between 18 and 65.');
    }

    // Mock payment function (you can replace this with actual payment integration)
    const paymentResponse = CompletePayment(userData);

    // Store data in the MySQL database
    const insertQuery = 'INSERT INTO user_data SET ?';
    db.query(insertQuery, userData, (err, result) => {
      if (err) {
        throw new Error('Error storing data in the database.');
      }

      console.log('Data stored in the MySQL database');
    });

    // Return response to the front-end based on payment result
    if (paymentResponse.success) {
      // Redirect to success page
      res.json({ success: true, redirectUrl: '/success' });
    } else {
      res.json({ success: false, message: 'Form data received, but payment failed.' });
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mock function for payment (you don't need to implement it)
function CompletePayment(userData) {
  // Mock implementation: Assume payment is always successful
  console.log('Processing payment for user:', userData);
  return { success: true };
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
