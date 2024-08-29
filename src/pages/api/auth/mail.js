// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message , subject } = req.body;

    // Create a transporter object using your email service
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const currentDate = new Date().toLocaleDateString();

    const mailOptions = {
      from: email,
      to: 'abhishek.jain@vervali.com',
      subject,
      html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You have a new message</title>

</head>
<body style="background-color: #f4f4f7;font-family: Arial, sans-serif;color: #51545e;margin:0;padding:0">
    <div style="background-color: #f4f4f7;padding: 20px;width: 100%;">
        <div style="max-width: 600px;margin: 0 auto;background-color: #ffffff;border-radius: 8px;overflow: hidden;">
            <div style="text-align: center;padding: 40px 0;background-color: #ffffff;">
                <img src="https://mallforwomen.com/cdn/shop/files/logo_transparent_2_180x.png?v=1688807313" style="width:150px" alt="Message Icon">
                <h1 style="color: #333333;font-size: 24px;margin: 0;">Hi, ${name}.</h1>
                <h2 style="font-size: 20px;color: #333333;margin-top: 0;">You have a new message.</h2>
            </div>
            <div style="padding: 30px;">
                <div style="padding: 20px;
            background-color: #f4f4f7;
            border-radius: 5px;
            font-style: italic;
            color: #51545e;
            margin-bottom: 30px;">
                    <p>${message}</p>
                </div>
                <p>Sent by ${ name } on ${currentDate}.</p>
                <a href="mailto:abhishek.jain@vervali.com" style=" display: block;width: 100%;text-align: center;background-color: #C475AB;color: white;padding: 15px 0;border-radius: 5px;text-decoration: none;font-size: 16px;">REPLY TO YOUR MESSAGE</a>
            </div>
        </div>
    </div>
</body>
</html>
      `
    };


    try {
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


{/* <div style="background-color: #C475AB;text-align: center;padding: 30px;color: #ffffff;">
<p style="margin:0;font-size:12px">
<a style="color: #ffffff;text-decoration: none;display: inline-block;margin: 0 10px; color:white;" href="https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/terms-&-service">Terms</a> |
<a style="color: #ffffff;text-decoration: none;display: inline-block;margin: 0 10px; color:white;" href="https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/contact-us">Contact Us</a> |
<a style="color: #ffffff;text-decoration: none;display: inline-block;margin: 0 10px; color:white;" href="https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/privacy-policy">Privacy</a> |
<a style="color: #ffffff;text-decoration: none;display: inline-block;margin: 0 10px; color:white;" href="https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/about-us">About Us</a></p>
<p>© ${new Date().getFullYear()} Mall For Women. All rights reserved.</p>
</div> */}
