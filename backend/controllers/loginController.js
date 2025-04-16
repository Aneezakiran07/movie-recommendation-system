const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDB, sql } = require('../db'); // SQL connection

const JWT_SECRET = process.env.JWT_SECRET; // Use env var in production

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Establish DB connection
    const pool = await connectToDB();

    // Safely query for the user by email
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare the provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate JWT token with 'user_id' instead of 'id'
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email }, // Change 'id' to 'user_id'
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and user info
    return res.json({
      token,
      user: {
        user_id: user.user_id,  // Change 'id' to 'user_id'
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = loginController;