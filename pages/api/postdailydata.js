import clientPromise from "../../utils/mysql";

const methods = {
  POST: async (req, res) => {
    try {
      const connection = await clientPromise;
      const time_stamp = Date.now();
      const { key,value } = req.body;
      const data_value = JSON.stringify(value);
      const timestamp_key = `${key}_${time_stamp}`

      await connection.query(
        'INSERT INTO health_data (`key`, `value`) VALUES (?, ?)',
        [timestamp_key, data_value]
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
