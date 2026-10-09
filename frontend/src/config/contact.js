// start of support contact details (change these to the shop's real details)
export const SUPPORT_EMAIL = "hello@example.com";

// WhatsApp number in international format with no + or spaces, e.g. "27821234567".
// Leave it as "" to hide the WhatsApp button everywhere.
export const WHATSAPP_NUMBER = "";
// end of support contact details

export const mailtoHref = (subject = "Support request") =>
	`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const whatsappHref = (text = "") =>
	`https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
