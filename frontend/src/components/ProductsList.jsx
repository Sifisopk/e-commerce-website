import { useMemo, useState } from "react";
import { Trash, Star, Pencil, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";

const iconButton =
	"flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, loading } = useProductStore();
	const { categories } = useCategoryStore();
	const [searchTerm, setSearchTerm] = useState("");

	const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

	// start of confirm before delete
	const handleDelete = (productId, productName) => {
		if (window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
			deleteProduct(productId);
		}
	};
	// end of confirm before delete

	// start of filter products
	const filteredProducts = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return products;
		return products.filter((p) => `${p.name} ${categoryName(p.category)}`.toLowerCase().includes(query));
	}, [products, searchTerm, categories]);
	// end of filter products

	// skeleton only for the first load (toggling a star or deleting also flips `loading`)
	if (loading && products.length === 0) {
		return (
			<div className='mx-auto max-w-4xl animate-pulse space-y-3'>
				{[...Array(4)].map((_, i) => (
					<div key={i} className='h-20 rounded-xl border border-line bg-surface' />
				))}
			</div>
		);
	}

	if (products.length === 0) {
		return <p className='text-center text-muted'>No products yet. Create your first one in the Create Product tab.</p>;
	}

	return (
		<div className='mx-auto max-w-4xl'>
			{/* start of search */}
			<div className='relative mb-3'>
				<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Search by name or category'
					className='h-11 w-full rounded-lg border border-[#D9D6D2] bg-white pl-10 pr-10 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
				/>
				{searchTerm && (
					<button
						type='button'
						onClick={() => setSearchTerm("")}
						aria-label='Clear search'
						className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink'
					>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>
			<p className='mb-4 text-sm text-muted'>
				Showing {filteredProducts.length} of {products.length} products
			</p>
			{/* end of search */}

			{filteredProducts.length === 0 ? (
				<p className='rounded-xl border border-line p-8 text-center text-muted'>No products match your search.</p>
			) : (
				<ul className='divide-y divide-line overflow-hidden rounded-xl border border-line bg-white'>
					{filteredProducts.map((product) => (
						<li key={product._id} className='flex items-center gap-3 p-3 sm:gap-4 sm:p-4'>
							<img
								className='h-14 w-14 shrink-0 rounded-lg bg-surface object-cover'
								src={product.images?.[0]}
								alt={product.name}
							/>

							<div className='min-w-0 flex-1'>
								<p className='truncate font-semibold text-ink'>{product.name}</p>
								<p className='text-sm text-muted'>
									<span>{categoryName(product.category)}</span> · R{product.price.toFixed(2)}
								</p>
							</div>

							<button
								onClick={() => toggleFeaturedProduct(product._id)}
								aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
								aria-pressed={product.isFeatured}
								title={product.isFeatured ? "Featured on the homepage" : "Feature on the homepage"}
								className={`${iconButton} ${
									product.isFeatured
										? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
										: "text-gray-400 hover:bg-surface hover:text-ink"
								}`}
							>
								<Star className='h-5 w-5' fill={product.isFeatured ? "currentColor" : "none"} />
							</button>

							<Link
								to={`/secret-dashboard/edit/${product._id}`}
								aria-label={`Edit ${product.name}`}
								className={`${iconButton} text-ink hover:bg-surface`}
							>
								<Pencil className='h-5 w-5' />
							</Link>

							<button
								onClick={() => handleDelete(product._id, product.name)}
								aria-label={`Delete ${product.name}`}
								className={`${iconButton} text-muted hover:bg-red-50 hover:text-brand`}
							>
								<Trash className='h-5 w-5' />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
export default ProductsList;
