import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM; // e.g. "Superfineboy <orders@yourdomain.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL; // optional: shown to customers in the email footer

// start of brand (same colours as the shop; web fonts don't load in most email apps, so Arial)
const RED = "#D4121A";
const INK = "#111111";
const MUTED = "#5E5E5E";
const SURFACE = "#F6F5F3";
const LINE = "#E7E5E2";
const FONT = "Arial, Helvetica, sans-serif";
// end of brand

const escapeHtml = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const money = (n) => `R${Number(n).toFixed(2)}`;

const PRODUCTION_APP_URL = "https://superfineboy.co.za";
const appUrl = () => {
    const clientUrl = String(process.env.CLIENT_URL || "").trim().replace(/\/+$/, "");
    const isLocalUrl = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(clientUrl);

    if (process.env.NODE_ENV === "production" && (!clientUrl || isLocalUrl)) {
        return PRODUCTION_APP_URL;
    }

    return clientUrl;
};

// start of building blocks (tables + inline styles: the only layout every email app understands)
const footerHtml = () =>
    `Superfineboy &middot; Quality fashion, delivered to you.${
        SUPPORT_EMAIL
            ? `<br>Questions? Email us at <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}" style="color:${RED};">${escapeHtml(SUPPORT_EMAIL)}</a>`
            : ""
    }`;

// "title" is HTML, so callers escape any customer text they put in it
const layout = ({ preheader, title, body }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Superfineboy</title>
</head>
<body style="margin:0;padding:0;background:${SURFACE};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:12px;">
<tr><td style="padding:24px 32px;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:24px;font-weight:bold;letter-spacing:-0.5px;color:${INK};">Superfine<span style="color:${RED};">boy</span></td></tr>
<tr><td style="padding:32px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">
<h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.25;color:${INK};">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid ${LINE};font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">${footerHtml()}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const button = (href, label) => {
    const safeHref = escapeHtml(href);
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:8px;background:${RED};"><a href="${safeHref}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a></td></tr></table>
<p style="margin:12px 0 0;font-size:12px;color:${MUTED};">If the button doesn't work, copy this link into your browser:<br><a href="${safeHref}" style="color:${MUTED};word-break:break-all;">${safeHref}</a></p>`;
};

const heading = (text) =>
    `<h3 style="margin:28px 0 8px;font-family:${FONT};font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">${text}</h3>`;

const infoBox = (inner) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 4px;"><tr><td style="background:${SURFACE};border-radius:8px;padding:16px;font-family:${FONT};font-size:14px;line-height:1.7;color:${INK};">${inner}</td></tr></table>`;

const orderNumberBox = (order) =>
    infoBox(
        `<span style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Order number</span><br><strong style="font-size:20px;">#${escapeHtml(order.orderNumber)}</strong>`
    );

const itemsTable = (order) => {
    const rows = order.products
        .map((p) => {
            const details = [p.color, p.size ? `Size ${p.size}` : "", `Qty ${p.quantity}`]
                .filter(Boolean)
                .map(escapeHtml)
                .join(" &middot; ");
            return `<tr>
<td style="padding:12px 0;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:15px;"><strong>${escapeHtml(p.name)}</strong><br><span style="font-size:13px;color:${MUTED};">${details}</span></td>
<td align="right" style="padding:12px 0 12px 12px;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:15px;font-weight:bold;white-space:nowrap;">${money(p.price * p.quantity)}</td>
</tr>`;
        })
        .join("");

    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}
<tr>
<td style="padding:16px 0 0;font-family:${FONT};font-size:16px;font-weight:bold;">Total</td>
<td align="right" style="padding:16px 0 0;font-family:${FONT};font-size:20px;font-weight:bold;color:${RED};">${money(order.totalAmount)}</td>
</tr>
</table>`;
};

const addressBox = (a) =>
    infoBox(
        `${escapeHtml(a.fullName)}<br>${escapeHtml(a.street)}, ${escapeHtml(a.suburb)}<br>${escapeHtml(a.city)}, ${escapeHtml(a.province)}, ${escapeHtml(a.postalCode)}<br>Phone: ${escapeHtml(a.phone)}`
    );
// end of building blocks

// start of order emails
export const sendCustomerOrderEmail = async ({ order, customer }) => {
    const html = layout({
        preheader: `We've got your order #${order.orderNumber}. Total ${money(order.totalAmount)}.`,
        title: `Thanks for your order, ${escapeHtml(customer.name)}!`,
        body: `<p style="margin:0 0 20px;">We've received your payment and we're getting your order ready.</p>
${orderNumberBox(order)}
${heading("Your items")}
${itemsTable(order)}
${heading("Delivering to")}
${addressBox(order.shippingAddress)}
<p style="margin:20px 0 0;">Estimated delivery: <strong>5-10 business days</strong>.</p>
${button(`${appUrl()}/track-order`, "Track your order")}
<p style="margin:12px 0 0;font-size:13px;color:${MUTED};">On the Track Order page, enter your order number and this email address.</p>`,
    });

    return resend.emails.send({
        from: FROM,
        to: customer.email,
        subject: `Order confirmed #${order.orderNumber}`,
        html,
    });
};

export const sendAdminOrderEmail = async ({ order, customer }) => {
    const html = layout({
        preheader: `${money(order.totalAmount)} from ${customer.name}`,
        title: `New paid order #${escapeHtml(order.orderNumber)}`,
        body: `${heading("Customer")}
${infoBox(`${escapeHtml(customer.name)}<br><a href="mailto:${escapeHtml(customer.email)}" style="color:${RED};">${escapeHtml(customer.email)}</a><br>${escapeHtml(order.shippingAddress?.phone)}`)}
${heading("Items")}
${itemsTable(order)}
${heading("Ship to")}
${addressBox(order.shippingAddress)}
<p style="margin:20px 0 0;font-size:12px;color:${MUTED};">Payment reference: ${escapeHtml(order.paymentReference)}</p>
${button(`${appUrl()}/secret-dashboard?tab=orders`, "Open orders")}`,
    });

    return resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `New order #${order.orderNumber} - ${money(order.totalAmount)}`,
        html,
    });
};

// never throws (an email failure must not break a paid order)
export const sendOrderEmails = async ({ order, customer }) => {
    const results = await Promise.allSettled([
        sendCustomerOrderEmail({ order, customer }),
        sendAdminOrderEmail({ order, customer }),
    ]);
    results.forEach((r, i) => {
        const label = i === 0 ? "customer" : "admin";
        if (r.status === "rejected") console.log(`Resend ${label} email failed:`, r.reason?.message);
        else if (r.value?.error) console.log(`Resend ${label} email error:`, r.value.error.message);
    });
};
// end of order emails

// start of account emails
// Resolves true if Resend accepted the email, false otherwise. Never throws.
const sendSafe = async (payload) => {
    try {
        const result = await resend.emails.send({ from: FROM, ...payload });
        if (result?.error) {
            console.log("Resend error:", result.error.message);
            return false;
        }
        return true;
    } catch (error) {
        console.log("Resend failed:", error.message);
        return false;
    }
};

export const sendVerificationEmail = ({ user, token }) =>
    sendSafe({
        to: user.email,
        subject: "Verify your email - Superfineboy",
        html: layout({
            preheader: "Confirm your email so your order confirmations reach you.",
            title: `Welcome, ${escapeHtml(user.name)}!`,
            body: `<p style="margin:0;">Please confirm this is your email address so we can send you order confirmations and delivery updates.</p>
${button(`${appUrl()}/verify-email/${token}`, "Verify my email")}
<p style="margin:16px 0 0;font-size:12px;color:${MUTED};">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`,
        }),
    });

export const sendPasswordResetEmail = ({ user, token }) =>
    sendSafe({
        to: user.email,
        subject: "Reset your password - Superfineboy",
        html: layout({
            preheader: "Use this link to choose a new password.",
            title: "Reset your password",
            body: `<p style="margin:0;">Hi ${escapeHtml(user.name)}, we received a request to reset your password.</p>
${button(`${appUrl()}/reset-password/${token}`, "Choose a new password")}
<p style="margin:16px 0 0;font-size:12px;color:${MUTED};">This link expires in 1 hour. If you didn't ask for this, you can ignore this email and your password will stay the same.</p>`,
        }),
    });
// end of account emails
