import sgMail from '@sendgrid/mail';
import clientPromise from "../../utils/mysql";
import { v4 as uuidv4 } from 'uuid';

const methods = {
  POST: async (req, res) => {
    try {
      const connection = await clientPromise;
      const { email } = req.body;

      const [existingUser] = await connection.query('SELECT firstName, lastName FROM user WHERE email = ?', [email]);

      if (existingUser.length > 0) {
        const { firstName, lastName } = existingUser[0];
        const token = generateToken();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const passwordResetLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/updatePassword?token=${token}`;
        const msg = {
          to: email,
          from: process.env.EMAIL_FROM,
          templateId: process.env.TEMPLATE_ID,
          dynamicTemplateData: {
            passwordResetLink: passwordResetLink,
          },
        };

        await sgMail.send(msg);

        await saveTokenInMySQL(connection, email, token);

        return res.status(200).json({ data: { firstName, lastName } });
      } else {
        return res.status(404).json({ error: "Email is incorrect" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

function generateToken() {
  return uuidv4();
}

async function saveTokenInMySQL(connection, email, token) {
  await connection.query('UPDATE user SET token = ? WHERE email = ?', [token, email]);
}

export default async (req, res) => {
  const method = req.method.toUpperCase();

  if (methods[method]) {
    await methods[method](req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
