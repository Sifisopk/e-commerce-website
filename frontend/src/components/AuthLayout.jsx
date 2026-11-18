// Shared shell for login, sign up, forgot/reset password
const AuthLayout = ({ title, subtitle, children, footer }) => (
	<div className='flex min-h-[75vh] items-center justify-center px-4 py-10 sm:px-6'>
		<div className='w-full max-w-md'>
			<h1 className='text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl'>{title}</h1>
			{subtitle && <p className='mt-2 text-center text-sm text-muted'>{subtitle}</p>}
			<div className='mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8'>{children}</div>
			{footer && <p className='mt-6 text-center text-sm text-muted'>{footer}</p>}
		</div>
	</div>
);

export default AuthLayout;
