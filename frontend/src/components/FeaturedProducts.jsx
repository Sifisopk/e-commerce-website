import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	useEffect(() => {
		const handleResize = () => {
			setItemsPerPage(window.innerWidth < 1024 ? 2 : 4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// start of slider maths (always lands on a full row, never an empty gap)
	const maxIndex = Math.max(0, featuredProducts.length - itemsPerPage);
	const safeIndex = Math.min(currentIndex, maxIndex);

	const nextSlide = () => setCurrentIndex(Math.min(safeIndex + itemsPerPage, maxIndex));
	const prevSlide = () => setCurrentIndex(Math.max(safeIndex - itemsPerPage, 0));

	const isStartDisabled = safeIndex === 0;
	const isEndDisabled = safeIndex >= maxIndex;
	// end of slider maths

	const arrowClass = (disabled) =>
		`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
			disabled
				? "cursor-not-allowed border-line text-gray-300"
				: "border-ink text-ink hover:bg-ink hover:text-white"
		}`;

	return (
		<section className='bg-surface py-12 sm:py-16'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mb-6 flex items-end justify-between gap-4'>
					<h2 className='font-display text-3xl font-bold tracking-tight sm:text-4xl'>Featured</h2>

					{featuredProducts.length > itemsPerPage && (
						<div className='flex gap-2'>
							<button onClick={prevSlide} disabled={isStartDisabled} aria-label='Previous products' className={arrowClass(isStartDisabled)}>
								<ChevronLeft size={20} />
							</button>
							<button onClick={nextSlide} disabled={isEndDisabled} aria-label='Next products' className={arrowClass(isEndDisabled)}>
								<ChevronRight size={20} />
							</button>
						</div>
					)}
				</div>

				<div className='-mx-1.5 overflow-hidden sm:-mx-2'>
					<div
						className='flex transition-transform duration-300 ease-in-out'
						style={{ transform: `translateX(-${safeIndex * (100 / itemsPerPage)}%)` }}
					>
						{featuredProducts?.map((product) => (
							<div key={product._id} className='w-1/2 flex-shrink-0 px-1.5 sm:px-2 lg:w-1/4'>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
export default FeaturedProducts;
