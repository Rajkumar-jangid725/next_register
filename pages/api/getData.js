import clientPromise from "../../utils/mysql";

const methods = {
  GET: async (req, res) => {
    try {
      const connection = await clientPromise;
   
      const [userDetails] = await connection.query('SELECT * FROM user');
      if (userDetails.length > 0) {
        return res.status(200).json({ data: userDetails });
      } else {
        return res.status(404).json({ error: "No users found" });
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
