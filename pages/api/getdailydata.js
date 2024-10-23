import clientPromise from "../../utils/mysql";

const methods = {
  GET: async (req, res) => {
    try {
      const connection = await clientPromise;
      const [healthDetails] = await connection.query('SELECT * FROM health_data');

      if (healthDetails.length > 0) {
        const { key, value } = healthDetails[0];

        const postResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/postdailydata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, value }),
        });

        if (!postResponse.ok) {
          throw new Error('Failed to send data to POST API');
        }

        return res.status(200).json({ data: healthDetails });
      } else {
        return res.status(404).json({ error: "No health data found" });
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
