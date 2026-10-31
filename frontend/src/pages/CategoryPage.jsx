import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

const CategoryPage = () => {
 const { fetchProductsByCategory, products, setProducts } = useProductStore();

const {category}=useParams();


 useEffect(() => {
    setProducts([]);
    fetchProductsByCategory(category);
}, [fetchProductsByCategory, category]);

const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

return(
    	<div className='min-h-screen'>
			<SEO
				title={categoryLabel}
				description={`Shop ${categoryLabel} at Superfineboy. Quality fashion for everyone, delivered across South Africa.`}
				url={`/category/${category}`}
			/>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* start of breadcrumb */}
				<nav className='flex items-center text-sm text-gray-400 mb-8 flex-wrap'>
					<Link to='/' className='hover:text-emerald-400'>
						Home
					</Link>
					<ChevronRight size={14} className='mx-2' />
					<span className='text-gray-300 capitalize'>{category}</span>
				</nav>
				{/* end of breadcrumb */}

				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-red-600 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{categoryLabel}
				</motion.h1>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
);
}



export default CategoryPage