import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const notifyJobseeker = async ({ email, name, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true, 
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
      tls: { rejectUnauthorized: false }
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                
                <tr>
                  <td bgcolor="#0052CC" style="padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Job Portal Career Center</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #172B4D; margin: 0 0 20px 0; font-size: 20px;">Dear ${name},</h2>
                    <p style="color: #5E6C84; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      We are pleased to provide you with an update regarding your application status.
                    </p>

                    <div style="background-color: #EBf5FF; border-left: 6px solid #0052CC; padding: 25px; border-radius: 4px; margin-bottom: 30px;">
                      <p style="margin: 0 0 10px 0; font-weight: bold; color: #0052CC; font-size: 14px; text-transform: uppercase;">Topic:</p>
                      <h3 style="margin: 0 0 15px 0; color: #172B4D; font-size: 18px;">${subject}</h3>
                      
                      <p style="margin: 0; color: #42526E; font-size: 16px; line-height: 1.6; font-style: italic;">
                        "${message}"
                      </p>
                    </div>

                    <p style="color: #5E6C84; font-size: 15px; margin-bottom: 30px;">
                      Please log in to the portal to schedule your session or provide additional documentation.
                    </p>

                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#0052CC" style="border-radius: 6px;">
                          <a href="#" style="display: inline-block; padding: 16px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;">Access Portal Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 30px; background-color: #F4F5F7; text-align: center; color: #8993A4; font-size: 12px;">
                    <p style="margin: 0 0 10px 0;">Job Portal Inc, 123 Tech Avenue, Nairobi, Kenya</p>
                    <p style="margin: 0;">This is an automated notification. Please do not reply directly to this email.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: "onboarding@resend.dev",
      to: email,
      subject: subject, // This is the "Subject" that shows in the list
      html: htmlContent,
    });

    console.log(`🚀 PROFESSIONAL EMAIL SENT successfully to ${email}`);
  } catch (error) {
    console.error("❌ Email Error:", error.message);
  }
};