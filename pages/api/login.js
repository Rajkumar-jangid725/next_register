import clientPromise from "../../utils/mysql";
import bcrypt from "bcrypt";

const methods = {
  POST: async (req, res) => {
    try {
      const connection = await clientPromise;

      const { email, password } = req.body;

      const [existingUser] = await connection.query('SELECT firstName, lastName, password FROM user WHERE email = ?', [email]);

      if (existingUser.length > 0) {
        const { firstName, lastName, password: hashedPassword } = existingUser[0];
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
          return res.status(200).json({ data: { firstName, lastName } });
        } else {
          return res.status(401).json({ error: "Email or password incorrect" });
        }
      } else {
        return res.status(401).json({ error: "Email or password incorrect" });
      }
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
