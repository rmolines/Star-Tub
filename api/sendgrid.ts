import sendgrid, { ResponseError } from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';

if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendmail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sendgrid.send({
      to: `${req.body.to}`, // Your email where you'll receive emails
      from: 'app@projectclam.com', // your website email address here
      subject: `${req.body.subject}`,
      html: `${req.body.html}`,
      // html: `<div>You've got a mail</div>`,
    });
  } catch (error: unknown) {
    // TODO: consertar error handling
    if (error instanceof ResponseError) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(200).json({ error: '' });
};

export default sendmail;
