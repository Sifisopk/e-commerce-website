import { Mail, MessageCircle } from "lucide-react";
import { SUPPORT_EMAIL, WHATSAPP_NUMBER, mailtoHref, whatsappHref } from "../config/contact";

// Reusable "Need help?" block. Pass orderNumber to prefill the email/WhatsApp message.
const ContactSupport = ({ message = "Need help?", orderNumber, className = "" }) => {
	const subject = orderNumber ? `Order #${orderNumber}` : "Support request";
	const whatsappText = orderNumber ? `Hi, I need help with order #${orderNumber}.` : "Hi, I need some help.";

	return (
		<div className={`rounded-lg border border-gray-200 bg-gray-50 p-4 text-center ${className}`}>
			<p className='text-sm text-gray-600'>{message}</p>
			<div className='mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4'>
				<a
					href={mailtoHref(subject)}
					className='inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700'
				>
					<Mail size={16} className='mr-1.5' />
					{SUPPORT_EMAIL}
				</a>
				{WHATSAPP_NUMBER && (
					<a
						href={whatsappHref(whatsappText)}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700'
					>
						<MessageCircle size={16} className='mr-1.5' />
						WhatsApp us
					</a>
				)}
			</div>
		</div>
	);
};

export default ContactSupport;
