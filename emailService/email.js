import nodemailer from "nodemailer";

export const sendEmail = (data) => {
    try {
        const { recieverEmail, subject, text } = data;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            secure: true,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: recieverEmail,
            subject: subject,
            text: "New Email .",
            html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
     ${text}
 
 </html>
 `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error while sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
