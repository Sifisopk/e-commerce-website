import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { SUPPORT_EMAIL, mailtoHref } from "../config/contact";

// start of inline brand icon (lucide-react no longer ships brand icons)
const InstagramIcon = (props) => (
	<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
		<rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
		<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
		<line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
	</svg>
);
// end of inline brand icon

const footerLink = "transition-colors hover:text-brand";

const Footer = () => {
	return (
		<footer className='border-t border-line bg-white'>
			<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
				<div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
					{/* start of brand */}
					<div>
						<p className='font-display text-2xl font-bold tracking-tight text-ink'>
							Superfine<span className='text-brand'>boy</span>
						</p>
						<p className='mt-2 text-sm text-muted'>Quality fashion, delivered to you.</p>
						<a href={mailtoHref("Support request")} className={`mt-3 inline-flex items-center text-sm text-muted ${footerLink}`}>
							<Mail size={16} className='mr-2' />
							{SUPPORT_EMAIL}
						</a>
					</div>
					{/* end of brand */}

					{/* start of links */}
					<nav className='flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink'>
						<Link to='/track-order' className={footerLink}>Track order</Link>
						<Link to='/cart' className={footerLink}>Cart</Link>
						<a href={mailtoHref("Support request")} className={footerLink}>Contact support</a>
						<a
							href='https://www.instagram.com/superfineboy2499/'
							target='_blank'
							rel='noopener noreferrer'
							className={`inline-flex items-center gap-1.5 ${footerLink}`}
						>
							<InstagramIcon width={16} height={16} />
							Instagram
						</a>
					</nav>
					{/* end of links */}
				</div>

				<div className='mt-8 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between'>
					<p>© {new Date().getFullYear()} Superfineboy. All rights reserved.</p>
					<p>
						Built by{" "}
						<a href='https://sfisodev.co.za/' className='font-medium text-ink transition-colors hover:text-brand'>
							SfisoDev
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
