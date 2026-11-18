import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import SEO from "../components/SEO";
import { useCategoryStore } from "../stores/useCategoryStore";

const CategoryPage = () => {
 const { fetchProductsByCategory, products, setProducts, loading } = useProductStore();
 const [loadedCategory, setLoadedCategory] = useState(null);
 const { categories } = useCategoryStore();

const {category}=useParams();

 // start of fetch (skeleton shows until THIS category has loaded, so "No products" never flashes)
 useEffect(() => {
    let cancelled = false;
    setProducts([]);
    fetchProductsByCategory(category).then(() => {
        if (!cancelled) setLoadedCategory(category);
    });
    return () => {
        cancelled = true;
    };
}, [fetchProductsByCategory, setProducts, category]);
 // end of fetch

const isLoading = loading || loadedCategory !== category;
const categoryLabel =
    categories.find((c) => c.slug === category)?.name || category.charAt(0).toUpperCase() + category.slice(1);

const gridClass = "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4";

return(
    	<div className='min-h-[70vh]'>
			<SEO
				title={categoryLabel}
				description={`Shop ${categoryLabel} at Superfineboy. Quality fashion for everyone, delivered across South Africa.`}
				url={`/category/${category}`}
			/>
			<div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
				{/* start of breadcrumb */}
				<nav className='mb-6 flex flex-wrap items-center text-sm text-muted'>
					<Link to='/' className='transition-colors hover:text-brand'>
						Home
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<span className='capitalize text-ink'>{category}</span>
				</nav>
				{/* end of breadcrumb */}

				<h1 className='mb-8 font-display text-4xl font-bold capitalize tracking-tight sm:text-5xl'>
					{categoryLabel}
				</h1>

				{/* start of loading / empty / grid */}
				{isLoading ? (
					<div className={gridClass}>
						{[...Array(8)].map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				) : products?.length === 0 ? (
					<div className='py-16 text-center'>
						<p className='text-xl font-semibold text-ink'>No products found</p>
						<Link to='/#categories' className='mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark'>
							Browse other categories
						</Link>
					</div>
				) : (
					<div className={gridClass}>
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				)}
				{/* end of loading / empty / grid */}
			</div>
		</div>
);
}

export default CategoryPage
