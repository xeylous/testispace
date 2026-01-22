import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email: string, otp: string) => {
    try {
        const mailOptions = {
            from: `"TestiSpace" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your TestiSpace Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-w-md mx-auto background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #607D3B; text-align: center;">Welcome to TestiSpace!</h2>
                        <p style="color: #333; text-align: center;">Please use the code below to verify your email address.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; padding: 10px 20px; background-color: #E9EED9; color: #2C3327; border-radius: 5px; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p style="text-align: center; color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw error to prevent crashing, but log it.
        // In productin you might want to handle this differently.
        return null;
    }
};
