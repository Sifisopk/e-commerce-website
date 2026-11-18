import SEO from "../components/SEO";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ChevronRight, Check, Truck, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useCategoryStore } from "../stores/useCategoryStore";

const ProductPage = () => {
	const { id } = useParams();
	const { currentProduct, fetchProductById, loading } = useProductStore();
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { categories } = useCategoryStore();

	const [activeImage, setActiveImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [fetchedId, setFetchedId] = useState(null);

	// start of fetch product on mount (skeleton shows until THIS product has loaded)
	useEffect(() => {
		let cancelled = false;
		fetchProductById(id).then(() => {
			if (!cancelled) setFetchedId(id);
		});
		return () => {
			cancelled = true;
		};
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
	if (loading || fetchedId !== id) {
		return (
			<div className='min-h-[70vh] bg-white'>
				<div className='mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
					<div className='mb-8 h-4 w-64 rounded bg-line' />
					<div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14'>
						<div className='aspect-[4/5] rounded-2xl bg-line' />
						<div className='space-y-4'>
							<div className='h-4 w-24 rounded bg-line' />
							<div className='h-10 w-3/4 rounded bg-line' />
							<div className='h-8 w-32 rounded bg-line' />
							<div className='h-24 w-full rounded bg-line' />
							<div className='h-14 w-full rounded-lg bg-line' />
						</div>
					</div>
				</div>
			</div>
		);
	}
	// end of loading skeleton

	if (!currentProduct) {
		return (
			<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white'>
				<h2 className='font-display text-2xl font-bold text-ink'>Product not found</h2>
				<Link to='/' className='font-medium text-brand hover:text-brand-dark'>
					Back to home
				</Link>
			</div>
		);
	}

	const categoryName =
		categories.find((c) => c.slug === currentProduct.category)?.name || currentProduct.category;

	return (
		<div className='bg-white'>
			<SEO
				title={currentProduct.name}
				description={currentProduct.description}
				image={currentProduct.images?.[0]}
				url={`/product/${currentProduct._id}`}
				jsonLd={{
					"@context": "https://schema.org",
					"@type": "Product",
					name: currentProduct.name,
					description: currentProduct.description,
					image: currentProduct.images,
					offers: {
						"@type": "Offer",
						priceCurrency: "ZAR",
						price: currentProduct.price,
						availability: "https://schema.org/InStock",
						url: `https://superfineboy.co.za/product/${currentProduct._id}`,
					},
				}}
			/>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
				{/* start of breadcrumb */}
				<nav className='mb-6 flex flex-wrap items-center text-sm text-muted sm:mb-8'>
					<Link to='/' className='transition-colors hover:text-brand'>
						Home
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<Link
						to={`/category/${currentProduct.category}`}
						className='capitalize transition-colors hover:text-brand'
					>
						{categoryName}
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<span className='text-ink'>{currentProduct.name}</span>
				</nav>
				{/* end of breadcrumb */}

				<div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14'>
					{/* start of image gallery */}
					<div>
						<div className='aspect-[5/5] max-w-[500px] overflow-hidden rounded-2xl border-2 border-line bg-surface'>
							<img
								src={currentProduct.images?.[activeImage]}
								alt={currentProduct.name}
								className='h-full w-full object-cover'
							/>
						</div>
						{currentProduct.images?.length > 1 && (
							<div className='mt-4 flex flex-wrap gap-3'>
								{currentProduct.images.map((img, index) => (
									<button
										key={index}
										onClick={() => setActiveImage(index)}
										aria-label={`Show photo ${index + 1}`}
										className={`h-20 w-20 overflow-hidden rounded-lg border-2 sm:h-[88px] sm:w-[88px] ${
											activeImage === index ? "border-ink" : "border-transparent"
										}`}
									>
										<img src={img} alt='' className='h-full w-full object-cover' />
									</button>
								))}
							</div>
						)}
					</div>
					{/* end of image gallery */}

					{/* start of details */}
					<div className='lg:sticky lg:top-28'>
						<p className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand'>
							{categoryName}
						</p>
						<h1 className='mb-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl'>
							{currentProduct.name}
						</h1>

						<p className='mb-5 text-3xl font-bold text-ink'>R{currentProduct.price}</p>

						<p className='mb-7 leading-relaxed text-muted'>{currentProduct.description}</p>

						{/* start of color selector */}
						{currentProduct.colors?.length > 0 && (
							<div className='mb-7'>
								<h3 className='mb-3 text-sm font-semibold text-ink'>
									Colour: <span className='font-normal capitalize text-muted'>{selectedColor}</span>
								</h3>
								<div className='flex flex-wrap gap-3.5'>
									{currentProduct.colors.map((color) => {
										const isSelected = selectedColor === color;
										return (
											<button
												key={color}
												type='button'
												onClick={() => setSelectedColor(color)}
												title={color}
												aria-label={color}
												aria-pressed={isSelected}
												className={`relative h-10 w-10 rounded-full ring-offset-2 transition ${
													isSelected ? "ring-2 ring-brand" : "ring-1 ring-[#D9D6D2] hover:ring-ink"
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
							<div className='mb-8'>
								<h3 className='mb-3 text-sm font-semibold text-ink'>Size</h3>
								<div className='flex flex-wrap gap-2.5'>
									{currentProduct.sizes.map((size) => (
										<button
											key={size}
											type='button'
											onClick={() => setSelectedSize(size)}
											aria-pressed={selectedSize === size}
											className={`h-12 min-w-[56px] rounded-lg border px-4 text-sm font-semibold uppercase transition-colors ${
												selectedSize === size
													? "border-ink bg-ink text-white"
													: "border-[#D9D6D2] bg-white text-ink hover:border-ink"
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}
						{/* end of size selector */}

						<button
							onClick={handleAddToCart}
							className='flex h-14 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200'
						>
							<ShoppingCart size={20} className='mr-2' />
							Add to cart
						</button>

						<ul className='mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-muted'>
							<li className='flex items-center gap-2.5'>
								<Truck size={18} className='shrink-0' />
								Delivery in 5–10 business days
							</li>
							<li className='flex items-center gap-2.5'>
								<PackageSearch size={18} className='shrink-0' />
								Track your order anytime with your order number
							</li>
						</ul>
					</div>
					{/* end of details */}
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
