type Email = { subject: string; text: string; html: string };
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function shopUrl() {
  try { const u = new URL(process.env.SITE_URL || ''); return u.protocol === 'https:' ? `${u.origin}/shop` : null; } catch { return null; }
}

function layout(preview: string, label: string, content: string, footer: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>SHOP.CO</title></head>
<body style="margin:0;padding:0;background-color:#f2f2f2;color:#171717;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f2f2f2;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
<tr><td style="padding:0 12px 24px;font-size:30px;font-weight:900;letter-spacing:-2px;color:#111111;">SHOP.CO<span style="font-size:18px;letter-spacing:0;">&#10022;</span></td></tr>
<tr><td style="padding:30px 28px;background-color:#111111;border-radius:20px 20px 0 0;"><p style="margin:0;color:#cccccc;font-size:11px;line-height:18px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">${label}</p></td></tr>
<tr><td style="padding:32px 28px;background-color:#ffffff;border-radius:0 0 20px 20px;">${content}</td></tr>
<tr><td style="padding:26px 20px;text-align:center;color:#666666;font-size:12px;line-height:20px;">${footer}<p style="margin:16px 0 0;font-weight:bold;letter-spacing:1px;color:#171717;">SHOP.CO &middot; Electronics for everyday life.</p><p style="margin:6px 0 0;">&copy; ${new Date().getFullYear()} SHOP.CO</p></td></tr>
</table></td></tr></table></body></html>`;
}

export function verificationEmail(name: string, code: string): Email {
  return {
    subject: 'Your SHOP.CO verification code',
    text: `Hi ${name},\n\nYour SHOP.CO verification code is ${code}.\n\nEnter it on the registration page to verify your email. It expires in 10 minutes. Never share this code.\n\nIf you did not request this code, ignore this email.\n\nSHOP.CO`,
    html: layout('Your verification code is ready. It expires in 10 minutes.', 'One last step', `
<h1 style="margin:0 0 20px;font-size:32px;line-height:38px;letter-spacing:-1px;">Make it official.</h1>
<p style="margin:0 0 12px;font-size:16px;line-height:26px;">Hi ${escape(name)},</p>
<p style="margin:0 0 24px;color:#555555;font-size:16px;line-height:26px;">Welcome to SHOP.CO. Enter the code below on the registration page to verify your email and finish creating your account.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding:26px 12px;background-color:#f2f2f2;border:1px solid #e5e5e5;border-radius:12px;">
<p style="margin:0 0 12px;font-size:11px;font-weight:bold;letter-spacing:2px;color:#666666;">YOUR VERIFICATION CODE</p>
<p style="margin:0;font-family:'Courier New',monospace;font-size:36px;line-height:44px;font-weight:bold;letter-spacing:6px;color:#111111;">${escape(code)}</p>
<p style="margin:12px 0 0;font-size:13px;line-height:20px;color:#666666;">Valid for 10 minutes</p></td></tr></table>
<p style="margin:24px 0 0;color:#555555;font-size:14px;line-height:24px;">Keep this code private. SHOP.CO will never ask you to share it by email or phone.</p>`, 'You received this email because someone requested a SHOP.CO account with your email address. If that wasn’t you, you can safely ignore it.'),
  };
}

export function passwordResetEmail(name: string, code: string): Email {
  return {
    subject: 'Reset your SHOP.CO password',
    text: `Hi ${name},\n\nYour password reset code is ${code}. It expires in 10 minutes. Enter it in the same browser where you requested it, along with your new password. Never share this code.\n\nIf you did not request a password reset, ignore this email. Your password has not changed.\n\nSHOP.CO`,
    html: layout('Use your code to reset your password. Valid for 10 minutes.', 'Account recovery', `<h1 style="margin:0 0 20px;font-size:32px;line-height:38px;">A fresh start.</h1><p style="font-size:16px;line-height:26px;color:#555555;">Hi ${escape(name)}, we received a request to reset your password. Enter this code with your new password in the same browser where you requested it.</p><div style="margin:24px 0;padding:28px 12px;text-align:center;background-color:#f2f2f2;border-radius:12px;"><p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;">PASSWORD RESET CODE</p><p style="margin:0;font-family:'Courier New',monospace;font-size:36px;line-height:44px;letter-spacing:6px;font-weight:bold;">${escape(code)}</p><p style="font-size:13px;color:#666666;">Expires in 10 minutes</p></div><p style="font-size:14px;line-height:24px;color:#555555;">Keep this code private. If you did not request a reset, you can ignore this email. Your password has not changed.</p>`, 'This email helps you recover access to your SHOP.CO account. Never send anyone your password or reset code.'),
  };
}

export function adminLoginEmail(name: string, code: string): Email {
  return {
    subject: 'Verify your SHOP.CO admin sign-in',
    text: `Hi ${name},\n\nYour admin sign-in code is ${code}. It expires in 10 minutes. Enter it on the login page to access the admin area. Never share it. If this was not you, change your password and contact the store owner.\n\nSHOP.CO`,
    html: layout('Confirm your admin sign-in. Code expires in 10 minutes.', 'Admin security', `<h1 style="margin:0 0 20px;font-size:32px;line-height:38px;">Confirm it is you.</h1><p style="font-size:16px;line-height:26px;color:#555555;">Hi ${escape(name)}, enter this code on the login page to complete your admin sign-in.</p><div style="margin:24px 0;padding:28px 12px;text-align:center;background-color:#f2f2f2;border-radius:12px;"><p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;">ADMIN SIGN-IN CODE</p><p style="margin:0;font-family:'Courier New',monospace;font-size:36px;line-height:44px;letter-spacing:6px;font-weight:bold;">${escape(code)}</p><p style="font-size:13px;color:#666666;">Expires in 10 minutes</p></div><p style="font-size:14px;line-height:24px;color:#555555;">Never share this code. If you did not try to sign in, change your password and contact the store owner.</p>`, 'This security email was sent after a successful password check for your admin account.'),
  };
}

export function newsletterEmail(): Email {
  const shop = shopUrl();
  return {
    subject: 'You’re on the list. Welcome to SHOP.CO.',
    text: `Welcome to the SHOP.CO newsletter!\n\nGood tech. Great finds. Straight to your inbox.\n\nYou’re on the list for new arrivals, latest offers and electronics worth a closer look.${shop ? `\n\nExplore the shop: ${shop}` : ''}\n\nTo unsubscribe, reply to this email with 'Unsubscribe'.\n\nSHOP.CO`,
    html: layout('New arrivals, latest offers and your next great find. Welcome aboard.', 'You’re on the list', `
<h1 style="margin:0 0 20px;font-size:36px;line-height:40px;letter-spacing:-1px;">Good tech.<br>Great finds.<br>Your inbox.</h1>
<p style="margin:0 0 28px;color:#555555;font-size:16px;line-height:26px;">Thanks for subscribing. Consider this your invitation to discover what’s new at SHOP.CO &mdash; and find something that fits the way you live.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f5;border-radius:12px;"><tr><td style="padding:24px;">
<p style="margin:0 0 18px;font-size:11px;font-weight:bold;letter-spacing:2px;color:#666666;">COMING TO YOUR INBOX</p>
<p style="margin:0 0 6px;font-size:17px;font-weight:bold;">01 &nbsp; Fresh arrivals</p><p style="margin:0 0 20px;color:#666666;font-size:14px;line-height:22px;">Meet the newest additions to our shelves.</p>
<p style="margin:0 0 6px;font-size:17px;font-weight:bold;">02 &nbsp; Offers worth opening</p><p style="margin:0 0 20px;color:#666666;font-size:14px;line-height:22px;">Keep up with our latest deals and promotions.</p>
<p style="margin:0 0 6px;font-size:17px;font-weight:bold;">03 &nbsp; Everyday upgrades</p><p style="margin:0;color:#666666;font-size:14px;line-height:22px;">Discover phones, laptops, audio and more.</p></td></tr></table>
${shop ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;"><tr><td bgcolor="#111111" style="border-radius:30px;text-align:center;"><a href="${escape(shop)}" style="display:inline-block;padding:16px 30px;border:1px solid #111111;border-radius:30px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Explore the shop &rarr;</a></td></tr></table>` : ''}
<p style="margin:28px 0 0;color:#555555;font-size:14px;line-height:24px;">See you in your inbox,<br><strong style="color:#171717;">The SHOP.CO team</strong></p>`, 'You received this email because you subscribed to the SHOP.CO newsletter.<br>Changed your mind? Reply with <strong>Unsubscribe</strong> and we’ll remove you from the list.'),
  };
}
