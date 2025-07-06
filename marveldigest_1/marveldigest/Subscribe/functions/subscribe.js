const { google } = require('googleapis');
const sheets = google.sheets('v4');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required.' }),
    };
  }

  try {
    // Authorize with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: require('./google-sheets-key.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Append the email to the 'Subscribers' sheet
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: 'Subscribers!A:A',
      valueInputOption: 'RAW',
      resource: {
        values: [[email]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscribed successfully.' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
