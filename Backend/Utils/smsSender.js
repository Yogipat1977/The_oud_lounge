// Backend/Utils/smsSender.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize client if credentials are set
let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('Twilio credentials (TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN) are not set. SMS sending will be disabled.');
}

const sendSms = async (to, body) => {
    if (!client) {
        console.log('Twilio client not initialized. SMS not sent.');
        return Promise.resolve({ sid: null, status: 'disabled' }); // Return a resolved promise
    }
    if (!to || !body || !twilioPhoneNumber) {
        console.error('Missing parameters for sending SMS: to, body, or Twilio phone number.');
        return Promise.reject(new Error('Missing parameters for SMS.'));
    }

    try {
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: to, // Recipient's phone number
        });
        console.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
        return message;
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.message);
        // You might want to throw the error or handle it based on your application's needs
        return Promise.reject(error);
    }
};

module.exports = sendSms;   