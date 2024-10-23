import clientPromise from "../../utils/mysql";
import bcrypt from 'bcrypt';

const methods = {
  POST: async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const url = new URL(req.headers.referer);
    const token = url.searchParams.get('token');

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    try {
      const connection = await clientPromise;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const [result] = await connection.query(
        'UPDATE user SET password = ? WHERE token = ?',
        [hashedPassword, token]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Invalid token or no changes made' });
      }

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default async (req, res) => {
  const method = req.method.toUpperCase();

  if (methods[method]) {
    await methods[method](req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
