const sendEmail = require("../utils/sendEmail");

const escapeHtml = (text) => String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sendContactForm = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body || {};

        if (
            typeof name !== "string" || !name.trim() ||
            typeof phone !== "string" || !phone.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof message !== "string" || !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain exactly 10 digits."
            });
        }

        const safeName = escapeHtml(name.trim());
        const safePhone = escapeHtml(phone.trim());
        const safeEmail = escapeHtml(email.trim());
        const safeMessage = escapeHtml(message.trim()).replace(/\r?\n/g, "<br>");

        await sendEmail({
            replyTo: email.trim(),
            subject: `New Booking Request from ${name.trim()}`,
            html: `
    <div style="background:#f4f4f4;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

        <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">

            <div style="background:#111111;padding:35px;text-align:center;">

                <h1 style="margin:0;color:#F2B27D;font-size:28px;font-weight:600;">
                    New Booking Request
                </h1>

                <p style="color:#cccccc;margin-top:8px;">
                    Someone contacted you through your portfolio website.
                </p>

            </div>

            <div style="padding:35px;">

                <h2 style="margin-top:0;color:#222;">
                    Customer Details
                </h2>

                <table
                    width="100%"
                    cellpadding="12"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                >

                    <tr>
                        <td style="font-weight:bold;width:160px;">Name</td>
                        <td>${safeName}</td>
                    </tr>

                    <tr style="background:#fafafa;">
                        <td style="font-weight:bold;">Phone</td>
                        <td>${safePhone}</td>
                    </tr>

                    <tr>
                        <td style="font-weight:bold;">Email</td>
                        <td>${safeEmail}</td>
                    </tr>

                </table>

                <div style="margin:35px 0;border-top:1px solid #e8e8e8;"></div>

                <h2 style="color:#222;">
                    Customer Message
                </h2>

                <div
                    style="
                        background:#fafafa;
                        border-left:5px solid #F2B27D;
                        padding:18px;
                        border-radius:10px;
                        line-height:1.7;
                        color:#555;
                    "
                >
                    ${safeMessage}
                </div>

            </div>

            <div
                style="
                    background:#111111;
                    padding:25px;
                    text-align:center;
                    color:#bbbbbb;
                    font-size:14px;
                "
            >
                This inquiry was submitted through the
                <strong style="color:#ffffff;">MR.KEMREWALA Photography</strong>
                portfolio website.

                <br><br>
            </div>
        </div>
    </div>`,
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully.",
        });

    } catch (error) {
        console.error("Contact email delivery failed:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send your message.",
        });
    }
};

module.exports = {
    sendContactForm,
};