import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM; // e.g. "Superfineboy <orders@yourdomain.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const escapeHtml = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const money = (n) => `R${Number(n).toFixed(2)}`;

const appUrl = () => String(process.env.CLIENT_URL || "").replace(/\/$/, "");

const itemsHtml = (order) =>
    order.products
        .map(
            (p) => `<tr>
<td style="padding:6px 0">${escapeHtml(p.name)}${p.color ? ` · ${escapeHtml(p.color)}` : ""}${p.size ? ` · Size ${escapeHtml(p.size)}` : ""}</td>
<td style="padding:6px 0;text-align:center">x${p.quantity}</td>
<td style="padding:6px 0;text-align:right">${money(p.price * p.quantity)}</td>
</tr>`
        )
        .join("");

const addressHtml = (a) =>
    `${escapeHtml(a.fullName)}<br>${escapeHtml(a.street)}, ${escapeHtml(a.suburb)}<br>${escapeHtml(a.city)}, ${escapeHtml(a.province)}, ${escapeHtml(a.postalCode)}<br>Phone: ${escapeHtml(a.phone)}`;

const wrap = (title, body) => `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
<h2 style="color:#dc2626">${title}</h2>${body}</div>`;

const button = (href, label) =>
    `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#dc2626;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">${label}</a></p>
<p style="font-size:12px;color:#6b7280">If the button doesn't work, copy this link into your browser:<br>${href}</p>`;

// start of order emails
export const sendCustomerOrderEmail = async ({ order, customer }) => {
    const html = wrap(
        `Thanks for your order, ${escapeHtml(customer.name)}!`,
        `<p>Order number: <strong>#${order.orderNumber}</strong></p>
<table style="width:100%;border-collapse:collapse">${itemsHtml(order)}</table>
<p style="text-align:right"><strong>Total: ${money(order.totalAmount)}</strong></p>
<h3>Delivering to</h3><p>${addressHtml(order.shippingAddress)}</p>
<p>Estimated delivery: 5-10 business days.</p>
<p>Track your order any time on our Track Order page with your order number and this email address.</p>`
    );

    return resend.emails.send({
        from: FROM,
        to: customer.email,
        subject: `Order confirmed #${order.orderNumber}`,
        html,
    });
};

export const sendAdminOrderEmail = async ({ order, customer }) => {
    const html = wrap(
        `New paid order #${order.orderNumber}`,
        `<p>Customer: ${escapeHtml(customer.name)} (${escapeHtml(customer.email)})</p>
<table style="width:100%;border-collapse:collapse">${itemsHtml(order)}</table>
<p style="text-align:right"><strong>Total: ${money(order.totalAmount)}</strong></p>
<h3>Ship to</h3><p>${addressHtml(order.shippingAddress)}</p>
<p>Payment reference: ${escapeHtml(order.paymentReference)}</p>`
    );

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
        html: wrap(
            `Welcome, ${escapeHtml(user.name)}!`,
            `<p>Please confirm this is your email address so we can send you order confirmations and delivery updates.</p>
${button(`${appUrl()}/verify-email/${token}`, "Verify my email")}
<p style="font-size:12px;color:#6b7280">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`
        ),
    });

export const sendPasswordResetEmail = ({ user, token }) =>
    sendSafe({
        to: user.email,
        subject: "Reset your password - Superfineboy",
        html: wrap(
            "Reset your password",
            `<p>Hi ${escapeHtml(user.name)}, we received a request to reset your password.</p>
${button(`${appUrl()}/reset-password/${token}`, "Choose a new password")}
<p style="font-size:12px;color:#6b7280">This link expires in 1 hour. If you didn't ask for this, you can ignore this email and your password will stay the same.</p>`
        ),
    });
// end of account emails
