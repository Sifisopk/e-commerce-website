import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	// start of handleAddToCart
	const handleAddToCart = (product) => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}

		const hasOptions = product.colors?.length > 0 || product.sizes?.length > 0;
		if (hasOptions) {
			toast("Please choose your size and colour first", { id: "options" });
			navigate(`/product/${product._id}`);
			return;
		}

		addToCart(product);
	};
	// end of handleAddToCart

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-3xl sm:text-5xl font-bold text-gray-900 mb-4'>Featured</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => {
								const hasOptions = product.colors?.length > 0 || product.sizes?.length > 0;

								return (
									<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
										<div className='bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all duration-300 hover:shadow-md border border-gray-200'>
											<Link to={`/product/${product._id}`}>
												<div className='overflow-hidden bg-gray-100'>
													<img
														src={product.images?.[0]}
														alt={product.name}
														className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
													/>
												</div>
											</Link>
											<div className='p-4'>
												<Link to={`/product/${product._id}`}>
													<h3 className='text-lg font-semibold mb-2 text-gray-900 hover:text-red-600'>{product.name}</h3>
												</Link>
												<p className='text-red-600 font-medium mb-4'>
													R{product.price.toFixed(2)}
												</p>
												<button
													onClick={() => handleAddToCart(product)}
													className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
													flex items-center justify-center'
												>
													<ShoppingCart className='w-5 h-5 mr-2' />
													{hasOptions ? "View details" : "Add to Cart"}
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 shadow-sm ${
							isStartDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 shadow-sm ${
							isEndDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;