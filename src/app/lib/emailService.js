import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const OAuth2 = google.auth.OAuth2;

/**
 * Get OAuth2 credentials for a specific location
 * @param {string} location - Location identifier (e.g., 'scarborough')
 * @returns {Object} OAuth credentials
 */
function getOAuthCredentials(location) {
  const oauthFilePath = path.join(process.cwd(), `events${location.toLowerCase()}oauth.json`);

  if (!fs.existsSync(oauthFilePath)) {
    throw new Error(`OAuth file not found for ${location}: ${oauthFilePath}`);
  }

  const credentials = JSON.parse(fs.readFileSync(oauthFilePath, 'utf8'));
  return credentials;
}

/**
 * Create a nodemailer transporter with OAuth2 authentication
 * @param {string} location - Location identifier (e.g., 'scarborough')
 * @returns {Promise<nodemailer.Transporter>} Configured transporter
 */
async function createOAuthTransporter(location) {
  const credentials = getOAuthCredentials(location);

  const oauth2Client = new OAuth2(
    credentials.google_client_id,
    credentials.google_client_secret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: credentials.google_refresh_token
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: credentials.email_address,
      clientId: credentials.google_client_id,
      clientSecret: credentials.google_client_secret,
      refreshToken: credentials.google_refresh_token,
      accessToken: accessToken.token
    }
  });

  return transporter;
}

/**
 * Send email using OAuth2 authentication
 * @param {Object} options - Email options
 * @param {string} options.location - Location identifier (e.g., 'scarborough')
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @param {string} [options.replyTo] - Reply-to email address
 * @param {string} [options.from] - Sender email (defaults to OAuth email)
 * @returns {Promise<Object>} Send result
 */
export async function sendEmailWithOAuth(options) {
  const { location, to, subject, html, text, replyTo, from } = options;

  try {
    const transporter = await createOAuthTransporter(location);
    const credentials = getOAuthCredentials(location);

    const mailOptions = {
      from: from || credentials.email_address,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || credentials.email_address
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email with OAuth:', error);
    throw error;
  }
}

/**
 * Send self-email (email to the location's own address)
 * @param {Object} options - Email options
 * @param {string} options.location - Location identifier (e.g., 'scarborough')
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @param {string} [options.replyTo] - Reply-to email address
 * @returns {Promise<Object>} Send result
 */
export async function sendSelfEmail(options) {
  const { location, subject, html, text, replyTo } = options;
  const credentials = getOAuthCredentials(location);

  return sendEmailWithOAuth({
    location,
    to: credentials.email_address,
    subject,
    html,
    text,
    replyTo
  });
}
