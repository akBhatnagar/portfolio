import { Resend } from "resend";

let _resend = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendEmail({ to, subject, text, html }) {
  const resend = getResend();
  const from = process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}
