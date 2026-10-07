import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM; // e.g. "Superfineboy <orders@yourdomain.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const escapeHtml = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const money = (n) => `R${Number(n).toFixed(2)}`;

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

// start of customer confirmation
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
// end of customer confirmation

// start of admin notification
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
// end of admin notification

// start of send both, never throws (an email failure must not break a paid order)
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
// end of send both emails