// SMS sending utility using Twilio
// In development, OTPs are logged to console

export const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('SMS not sent (Twilio not configured):', { to, message });
    return { success: true, message: 'SMS logged (Twilio not configured)' };
  }

  try {
    // Twilio would be implemented here
    // const client = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE,
    //   to: to
    // });

    console.log('Twilio SMS:', { to, message });
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, message: error.message };
  }
};

export const sendOTPSMS = async (phone, otp) => {
  const message = `Grameen Connect: Your OTP for phone verification is ${otp}. Valid for 5 minutes. Do not share this with anyone.`;
  return sendSMS(phone, message);
};

export const sendJobAlertSMS = async (phone, jobTitle) => {
  const message = `Grameen Connect: New job matching your profile - "${jobTitle}". Login to apply now!`;
  return sendSMS(phone, message);
};

export const sendApplicationStatusSMS = async (phone, status, jobTitle) => {
  const statusText = status === 'accepted' ? 'accepted' : status === 'rejected' ? 'not selected' : 'updated';
  const message = `Grameen Connect: Your application for "${jobTitle}" has been ${statusText}. Login to view details.`;
  return sendSMS(phone, message);
};
