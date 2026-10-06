import { Link } from "react-router-dom";
import { Mail } from "lucide-react";


const InstagramIcon = (props) => (
	<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
		<rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
		<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
		<line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
	</svg>
);

const FacebookIcon = (props) => (
	<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
		<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
	</svg>
);
// end of inline brand icons

const Footer = () => {
	return (
		<footer className='bg-white border-t border-gray-200 mt-auto'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
					{/* start of brand */}
					<div>
						<h3 className='text-xl font-bold text-red-600 mb-2'>Superfineboy</h3>
						<p className='text-sm text-gray-500'>
							Quality fashion, delivered to you.
						</p>
					</div>
					{/* end of brand */}

					{/* start of quick links */}
					<div>
						<h4 className='text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3'>Quick Links</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link to='/' className='text-gray-500 hover:text-red-600'>Home</Link>
							</li>
							<li>
								<Link to='/cart' className='text-gray-500 hover:text-red-600'>Cart</Link>
							</li>
							<li>
								<Link to='/login' className='text-gray-500 hover:text-red-600'>Login</Link>
							</li>
						</ul>
					</div>
					{/* end of quick links */}

					{/* start of contact */}
					<div>
						<h4 className='text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3'>Get in touch</h4>
						<a href='mailto:hello@example.com' className='flex items-center text-sm text-gray-500 hover:text-red-600 mb-3'>
							<Mail size={16} className='mr-2' />
							hello@example.com
						</a>
						<div className='flex gap-4'>
							<a href='#' className='text-gray-400 hover:text-red-600'>
								<InstagramIcon width={20} height={20} />
							</a>
							<a href='#' className='text-gray-400 hover:text-red-600'>
								<FacebookIcon width={20} height={20} />
							</a>
						</div>
					</div>
					{/* end of contact */}
				</div>
				<div className='mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-400'>
					© {new Date().getFullYear()} Superfineboy. All rights reserved. 
                    <a href='https://sfisodev.co.za/' className='text-red-600  hover:text-emerald-400'>
								  Built by SfisoDev
							</a>
                    
				</div>
			</div>
		</footer>
	);
};

export default Footer;