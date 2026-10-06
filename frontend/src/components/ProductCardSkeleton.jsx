const ProductCardSkeleton = () => {
	return (
		<div className='flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm animate-pulse'>
			<div className='mx-3 mt-3 h-60 rounded-xl bg-gray-200' />
			<div className='mt-4 px-5 pb-5 space-y-3'>
				<div className='h-5 w-3/4 rounded bg-gray-200' />
				<div className='h-7 w-1/3 rounded bg-gray-200' />
				<div className='h-10 w-full rounded-lg bg-gray-200' />
			</div>
		</div>
	);
};

export default ProductCardSkeleton;