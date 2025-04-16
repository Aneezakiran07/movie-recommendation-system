const { connectToDB, sql } = require('../db');

const getUserInfoController = async (req, res) => {
  const userId = req.user.user_id; // set by auth middleware

  try {
    // Establish DB connection
    const pool = await connectToDB();

    // Safely query for the user by ID
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT user_id, username, email FROM Users WHERE user_id = @userId');

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send the user data
    res.json(user);

  } catch (err) {
    console.error('GetUserInfo error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = getUserInfoController;