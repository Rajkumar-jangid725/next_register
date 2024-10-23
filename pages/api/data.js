import clientPromise from "../../utils/mysql";

const methods = {
  GET: async (req, res) => {
    try {
      const connection = await clientPromise;
      const [users] = await connection.query('SELECT * FROM user');
      res.json(users);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  POST: async (req, res) => {
    try {
      const connection = await clientPromise;

      const { firstName, lastName, email, password } = req.body;

      const [existingUser] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      await connection.query(
        'INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, password]
      );
      res.status(201).json({ message: "Data inserted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
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
