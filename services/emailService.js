const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'user@example.com', // Your SMTP username
        pass: 'yourpassword' // Your SMTP password
    }
});

// Function to send download email
const sendDownloadEmail = (recipientEmail, downloadLink) => {
    const mailOptions = {
        from: 'sender@example.com', // Sender address
        to: recipientEmail, // List of receivers
        subject: 'Your Download Link', // Subject line
        text: `Here is your download link: ${downloadLink}`, // Plain text body
        // html: '<b>Hello world?</b>' // HTML body (optional)
    };

    return transporter.sendMail(mailOptions);
};

// Function to send order confirmation email
const sendOrderConfirmation = (recipientEmail, orderDetails) => {
    const mailOptions = {
        from: 'sender@example.com', // Sender address
        to: recipientEmail, // List of receivers
        subject: 'Order Confirmation', // Subject line
        text: `Thank you for your order! Details: ${JSON.stringify(orderDetails)}`, // Plain text body
        // html: '<b>Thank you for your order!</b>' // HTML body (optional)
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendDownloadEmail,
    sendOrderConfirmation
};
