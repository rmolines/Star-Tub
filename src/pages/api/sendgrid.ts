import sendgrid from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendmail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sendgrid.send({
      to: `${req.body.to}`, // Your email where you'll receive emails
      from: 'app@projectclam.com', // your website email address here
      subject: `${req.body.subject}`,
      html: `${req.body.html}`,
      // html: `<div>You've got a mail</div>`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: '' });
};

export default sendmail;
