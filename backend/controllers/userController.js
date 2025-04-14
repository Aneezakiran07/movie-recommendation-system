const { connectToDB, sql } = require('../db');

// 🔹 Add a new user
const createUser = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and Email are required' });
  }

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .query('INSERT INTO Users (username, email) VALUES (@username, @email)');

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(' Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// 🔹 Get all users (for testing)
const getAllUsers = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching users:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// 🔹 Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('DELETE FROM Users WHERE user_id = @userId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(' Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser
};
