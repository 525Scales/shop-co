import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) throw new Error("Gmail is not configured");
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass }, connectionTimeout: 10000, socketTimeout: 15000 });
  await transport.sendMail({ from: { name: "SHOP.CO", address: user }, to, subject, text, html });
}
