const LoadingSpinner = () => {
	return (
		<div className='flex min-h-[60vh] items-center justify-center bg-white'>
			<div className='relative'>
				<div className='h-16 w-16 rounded-full border-2 border-line' />
				<div className='absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-t-2 border-brand' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
