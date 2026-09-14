const transporter = require("../config/mailConfig");

const sendContactForm = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        if (!name || !phone || !email || !message) {
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

        const mailOptions = {
            from: `"MR. Kemrewala Photography" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            replyTo: email,
            subject: `New Booking Request from ${name}`,

            html: `
    <div style="background:#f4f4f4;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

        <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">

            <!-- Header -->
            <div style="background:#111111;padding:35px;text-align:center;">

                <img
                    src="cid:logo"
                    alt="MR. Kemrewala"
                    style="width:180px;margin-bottom:15px;"
                />

                <h1 style="margin:0;color:#F2B27D;font-size:28px;font-weight:600;">
                    New Booking Request
                </h1>

                <p style="color:#cccccc;margin-top:8px;">
                    Someone contacted you through your portfolio website.
                </p>

            </div>

            <!-- Content -->

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
                        <td>${name}</td>
                    </tr>

                    <tr style="background:#fafafa;">
                        <td style="font-weight:bold;">Phone</td>
                        <td>${phone}</td>
                    </tr>

                    <tr>
                        <td style="font-weight:bold;">Email</td>
                        <td>${email}</td>
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
                    ${message}
                </div>

            </div>

            <!-- Footer -->

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

    </div>
    `,

            attachments: [
                {
                    filename: "logo.png",
                    path: "./assets/logo.png",
                    cid: "logo",
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Your inquiry has been sent successfully!",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send inquiry.",
        });
    }
};

module.exports = {
    sendContactForm,
};