export default function SupportContact() {
  const email = process.env.SUPPORT_EMAIL || process.env.GMAIL_USER;
  return <p className="leading-relaxed text-black/60">{email ? <>Email <a href={`mailto:${email}`} className="font-medium text-ink underline underline-offset-4">{email}</a> with your question. </> : <>Reply to a SHOP.CO email to reach the store. </>}For order enquiries, include your order number and the email used at checkout. Never send your password or verification code.</p>;
}
