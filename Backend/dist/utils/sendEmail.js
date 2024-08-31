import nodemailer from "nodemailer";
// import nodemailer from 'nodemailer';
export const sendEmail = async (to, otp, p0) => {
    console.log('mail');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'peacesllr@gmail.com',
            pass: 'vypa bepv rele ybui'
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
