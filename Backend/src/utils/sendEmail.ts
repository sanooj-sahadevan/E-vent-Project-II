import nodemailer from "nodemailer";
export const sendEmail = async (to: string, otp: string, p0?: string) => {
    try {
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
    } catch (error) {
        next(error)
    }

};
function next(error: unknown) {
    throw new Error("Function not implemented.");
}

