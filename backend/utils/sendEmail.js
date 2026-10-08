const { Resend } = require("resend");

let resend;

const sendEmail = async ({ subject, html, replyTo }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.EMAIL;

    if (!apiKey || !from || !to) {
        throw new Error("Email service configuration is incomplete.");
    }

    if (!resend) resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
    });

    if (error) throw error;
    return data;
};

module.exports = sendEmail;
