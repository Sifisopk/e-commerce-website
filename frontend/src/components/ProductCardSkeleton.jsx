const ProductCardSkeleton = () => {
	return (
		<div className='flex w-full animate-pulse flex-col overflow-hidden rounded-xl border border-line bg-white'>
			<div className='aspect-[4/5] w-full bg-line' />
			<div className='space-y-3 p-3 sm:p-4'>
				<div className='h-5 w-3/4 rounded bg-line' />
				<div className='h-6 w-1/3 rounded bg-line' />
				<div className='h-10 w-full rounded-lg bg-line' />
			</div>
		</div>
	);
};

export default ProductCardSkeleton;
