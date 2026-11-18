import { Loader } from "lucide-react";

const AuthSubmit = ({ loading, loadingText = "Loading...", icon: Icon, children }) => (
	<button
		type='submit'
		disabled={loading}
		className='flex h-12 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50'
	>
		{loading ? (
			<>
				<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
				{loadingText}
			</>
		) : (
			<>
				{Icon && <Icon className='mr-2 h-5 w-5' aria-hidden='true' />}
				{children}
			</>
		)}
	</button>
);

export default AuthSubmit;
