import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";

import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/sweatpants", name: "sweatpants", imageUrl: "/sweatpant.jpeg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/t-shirt.jpeg" },
	{ href: "/hoodies", name: "Hoodies", imageUrl: "/hoodie.jpeg" },
	//{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	//{ href: "/jackets", name: "Jackets", imageUrl: "/jacket.jpeg" },
	{ href: "/beanies", name: "Beanies", imageUrl: "/beanie.jpeg" },
	//{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];



const Homepage = () => {
const { fetchFeaturedProducts, products, loading } = useProductStore();


	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

  return (
  <div className='relative min-h-screen text-gray-900 overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16'>
				
				<h1 className='mt-10 text-center text-4xl sm:text-6xl font-bold text-gray-900 mb-4'>
					Explore Our <span className='text-red-600'>Categories</span>
				</h1>
				<p className='text-center text-lg sm:text-xl text-gray-600 mb-12'>
					Discover the latest trends in fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
				{/* start of featured products / loading */}
				{loading ? (
					<FeaturedProductsSkeleton />
				) : (
					products.length > 0 && <FeaturedProducts featuredProducts={products} />
				)}
				{/* end of featured products / loading */}
			</div>
		</div>
	);
}

// start of featured products skeleton
const FeaturedProductsSkeleton = () => (
	<div className='py-12'>
		<div className='container mx-auto px-4'>
			<div className='h-12 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-8' />
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[...Array(4)].map((_, i) => (
					<div key={i} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse'>
						<div className='h-48 bg-gray-200' />
						<div className='p-4 space-y-3'>
							<div className='h-5 w-3/4 bg-gray-200 rounded' />
							<div className='h-4 w-1/3 bg-gray-200 rounded' />
							<div className='h-9 w-full bg-gray-200 rounded' />
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);
// end of featured products skeleton

export default Homepage