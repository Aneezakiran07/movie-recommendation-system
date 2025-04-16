const bcrypt = require('bcryptjs');
const { connectToDB, sql } = require('../db'); // SQL connection

const signupController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Establish DB connection
    const pool = await connectToDB();

    // Check if user already exists (by email or username)
    const existingUser = await pool.request()
      .input('email', sql.VarChar, email)
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE email = @email OR username = @username');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ msg: 'Email or username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO Users (username, email, password) VALUES (@username, @email, @password)');

    return res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = signupController;