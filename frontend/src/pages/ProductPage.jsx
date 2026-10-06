import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductPage = () => {
	const { id } = useParams();
	const { currentProduct, fetchProductById, loading } = useProductStore();
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const [activeImage, setActiveImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");

	// start of fetch product on mount
	useEffect(() => {
		fetchProductById(id);
	}, [fetchProductById, id]);
	// end of fetch product on mount

	// start of reset selections when product changes
	useEffect(() => {
		if (currentProduct) {
			setActiveImage(0);
			setSelectedColor(currentProduct.colors?.[0] || "");
			setSelectedSize(currentProduct.sizes?.[0] || "");
		}
	}, [currentProduct]);
	// end of reset selections when product changes

const handleAddToCart = () => {
    if (!user) {
        toast.error("Please login to add products to cart", { id: "login" });
        return;
    }
    addToCart(currentProduct, { color: selectedColor, size: selectedSize });
};

	// start of loading skeleton
	if (loading) {
		return (
			<div className='min-h-screen bg-white'>
				<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse'>
					<div className='h-4 w-64 bg-gray-200 rounded mb-8' />
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
						<div className='h-[500px] bg-gray-200 rounded-lg' />
						<div className='space-y-4'>
							<div className='h-4 w-24 bg-gray-200 rounded' />
							<div className='h-10 w-3/4 bg-gray-200 rounded' />
							<div className='h-8 w-32 bg-gray-200 rounded' />
							<div className='h-24 w-full bg-gray-200 rounded' />
							<div className='h-14 w-full bg-gray-200 rounded-lg' />
						</div>
					</div>
				</div>
			</div>
		);
	}
	// end of loading skeleton

	if (!currentProduct) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center gap-4 bg-white'>
				<h2 className='text-2xl text-gray-600'>Product not found</h2>
				<Link to='/' className='text-red-600 hover:text-red-700'>
					Back to home
				</Link>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-white'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* start of breadcrumb */}
				<nav className='flex items-center text-sm text-gray-500 mb-8 flex-wrap'>
					<Link to='/' className='hover:text-red-600'>
						Home
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<Link
						to={`/category/${currentProduct.category}`}
						className='hover:text-red-600 capitalize'
					>
						{currentProduct.category}
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<span className='text-gray-900'>{currentProduct.name}</span>
				</nav>
				{/* end of breadcrumb */}

				<motion.div
					className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* start of image gallery */}
					<div>
						<div className='rounded-lg overflow-hidden border border-gray-200 bg-gray-50'>
							<img
								src={currentProduct.images?.[activeImage]}
								alt={currentProduct.name}
								className='w-full h-[350px] sm:h-[500px] object-cover'
							/>
						</div>
						{currentProduct.images?.length > 1 && (
							<div className='mt-4 flex gap-3 flex-wrap'>
								{currentProduct.images.map((img, index) => (
									<button
										key={index}
										onClick={() => setActiveImage(index)}
										className={`h-20 w-20 rounded-md overflow-hidden border-2 ${
											activeImage === index ? "border-red-600" : "border-gray-200"
										}`}
									>
										<img src={img} alt={`${currentProduct.name} ${index + 1}`} className='w-full h-full object-cover' />
									</button>
								))}
							</div>
						)}
					</div>
					{/* end of image gallery */}

					{/* start of details */}
					<div className='lg:sticky lg:top-24'>
						<p className='text-sm text-red-600 uppercase tracking-wide mb-1 capitalize'>
							{currentProduct.category}
						</p>
						<h1 className='text-2xl sm:text-4xl font-bold text-gray-900 mb-4'>
							{currentProduct.name}
						</h1>

						<div className='mb-6'>
							<span className='text-3xl font-bold text-gray-900'>
							R{currentProduct.price}
							</span>
						</div>

						{/* start of color selector */}
						{currentProduct.colors?.length > 0 && (
							<div className='mb-6'>
								<h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3'>
									Color: <span className='normal-case text-gray-500'>{selectedColor}</span>
								</h3>
								<div className='flex gap-3 flex-wrap'>
									{currentProduct.colors.map((color) => {
										const isSelected = selectedColor === color;
										return (
											<button
												key={color}
												type='button'
												onClick={() => setSelectedColor(color)}
												title={color}
												aria-label={color}
												className={`relative h-10 w-10 rounded-full border-2 transition-transform ${
													isSelected ? "border-red-600 scale-110" : "border-gray-300 hover:border-gray-400"
												}`}
												style={{ backgroundColor: color.toLowerCase() }}
											>
												{isSelected && (
													<Check
														size={16}
														className='absolute inset-0 m-auto text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]'
													/>
												)}
											</button>
										);
									})}
								</div>
							</div>
						)}
						{/* end of color selector */}

						{/* start of size selector */}
						{currentProduct.sizes?.length > 0 && (
							<div className='mb-6'>
								<h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2'>
									Size
								</h3>
								<div className='flex gap-2 flex-wrap'>
									{currentProduct.sizes.map((size) => (
										<button
											key={size}
											onClick={() => setSelectedSize(size)}
											className={`px-4 py-2 rounded-md border text-sm uppercase transition-colors ${
												selectedSize === size
													? "border-red-600 bg-red-50 text-red-600"
													: "border-gray-300 text-gray-700 hover:border-gray-400"
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}
						{/* end of size selector */}

						<div className='border-t border-gray-200 pt-6 mb-6'>
							<h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2'>
								Description
							</h3>
							<p className='text-gray-600 leading-relaxed'>
								{currentProduct.description}
							</p>
						</div>

						<button
							onClick={handleAddToCart}
							className='flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-4 text-base font-semibold
							 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-colors duration-200'
						>
							<ShoppingCart size={20} className='mr-2' />
							Add to cart
						</button>

						<div className='mt-6 border-t border-gray-200 pt-6 flex items-center justify-between text-sm'>
							<span className='text-gray-500'>Sold by</span>
							<span className='text-gray-900 font-medium'>Superfineboy</span>
						</div>
					</div>
					{/* end of details */}
				</motion.div>
			</div>
		</div>
	);
};

export default ProductPage;