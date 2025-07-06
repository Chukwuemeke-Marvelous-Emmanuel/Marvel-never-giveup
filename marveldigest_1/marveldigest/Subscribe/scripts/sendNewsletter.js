require('dotenv').config();
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

(async () => {
  try {
    // Google Sheets setup
    const auth = new google.auth.GoogleAuth({
      credentials: require('../functions/google-sheets-key.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Get all subscriber emails
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Subscribers!A:A',
    });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      console.log('No subscribers found.');
      return;
    }

    const emails = rows.flat().filter(e => e && e.includes('@'));

    // Gmail SMTP setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emails,
      subject: 'New Post Published!',
      text: 'Hello! We have published a new post. Visit our website to read it.',
      html: '<p>Hello!</p><p>We have published a new post. <a href="https://yourwebsite.com">Visit our website</a> to read it.</p>',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Emails sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending newsletter:', err);
  }
})();
