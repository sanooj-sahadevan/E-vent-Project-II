import nodemailer from "nodemailer";

// import nodemailer from 'nodemailer';
export const sendEmail = async (to: string, otp: string, p0?: string) => {
    console.log('mail');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: 'peacesllr@gmail.com',
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};
