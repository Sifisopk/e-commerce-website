import { useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryItem from "../components/CategoryItem";
import SEO from "../components/SEO";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

import { useProductStore } from "../stores/useProductStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import FeaturedProducts from "../components/FeaturedProducts";

// "sweatpants, t-shirts and hoodies": used so the search-engine description follows the admin's categories
const joinNames = (names) =>
	names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

const Homepage = () => {
const { fetchFeaturedProducts, products, loading } = useProductStore();
const { hero, loaded: settingsLoaded } = useSettingsStore();
const { categories, loaded: categoriesLoaded } = useCategoryStore();

	// start of search-engine description (follows the categories in Dashboard > Categories)
	const categoryNames = categories.map((c) => c.name.toLowerCase());
	const description = categoryNames.length
		? `Shop the latest ${joinNames(categoryNames)} at Superfineboy. Quality fashion for everyone, delivered across South Africa.`
		: "Shop quality fashion at Superfineboy, delivered across South Africa.";
	// end of search-engine description

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

  return (
  <div>
			<SEO
				title="Shop Fashion For Everyone"
				description={description}
				url="/"
				jsonLd={{
					"@context": "https://schema.org",
					"@type": "Organization",
					name: "Superfineboy",
					url: "https://superfineboy.co.za",
					logo: "https://superfineboy.co.za/favicon.svg",
				}}
			/>

			{/* start of hero (text, button and photo are edited in Dashboard > Settings) */}
			{settingsLoaded ? (
				<section className='mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16 lg:px-8'>
					<div>
						{hero.eyebrow && (
							<p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand'>{hero.eyebrow}</p>
						)}
						<h1 className='font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl lg:text-7xl'>
							{hero.title}
						</h1>
						{hero.text && (
							<p className='mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg'>{hero.text}</p>
						)}
						<div className='mt-8 flex flex-col gap-3 sm:flex-row'>
							{hero.primaryLabel && (
								<Link
									to={hero.primaryLink || "/"}
									className='rounded-lg bg-brand px-7 py-4 text-center font-semibold text-white transition-colors hover:bg-brand-dark'
								>
									{hero.primaryLabel}
								</Link>
							)}
							<a
								href='#categories'
								className='rounded-lg border border-ink px-7 py-4 text-center font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
							>
								Browse categories
							</a>
						</div>
					</div>
					<div className='aspect-square overflow-hidden rounded-2xl bg-surface'>
						{hero.image && <img src={hero.image} alt={hero.title} className='h-full w-full object-cover' />}
					</div>
				</section>
			) : (
				<HeroSkeleton />
			)}
			{/* end of hero */}

			{/* start of categories (added and removed in Dashboard > Categories) */}
			{(!categoriesLoaded || categories.length > 0) && (
				<section id='categories' className='mx-auto max-w-7xl scroll-mt-20 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8'>
					<h2 className='mb-6 font-display text-3xl font-bold tracking-tight sm:text-4xl'>Shop by category</h2>
					<div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
						{categoriesLoaded
							? categories.map((category) => (
									<CategoryItem
										key={category._id}
										category={{ href: `/${category.slug}`, name: category.name, imageUrl: category.image }}
									/>
							  ))
							: [...Array(4)].map((_, i) => (
									<div key={i} className='aspect-[4/5] animate-pulse rounded-2xl bg-line' />
							  ))}
					</div>
				</section>
			)}
			{/* end of categories */}

			{/* start of featured products / loading */}
			{loading ? (
				<FeaturedProductsSkeleton />
			) : (
				products.length > 0 && <FeaturedProducts featuredProducts={products} />
			)}
			{/* end of featured products / loading */}
		</div>
	);
}

// start of hero skeleton (same shape as the hero, so nothing jumps when it loads)
const HeroSkeleton = () => (
	<section className='mx-auto grid max-w-7xl animate-pulse items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16 lg:px-8'>
		<div className='space-y-4'>
			<div className='h-3 w-24 rounded bg-line' />
			<div className='h-16 w-3/4 rounded bg-line' />
			<div className='h-5 w-2/3 rounded bg-line' />
			<div className='h-14 w-40 rounded-lg bg-line' />
		</div>
		<div className='aspect-square rounded-2xl bg-line' />
	</section>
);
// end of hero skeleton

// start of featured products skeleton
const FeaturedProductsSkeleton = () => (
	<section className='bg-surface py-12 sm:py-16'>
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<div className='mb-6 h-9 w-40 animate-pulse rounded bg-line' />
			<div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
				{[...Array(4)].map((_, i) => (
					<ProductCardSkeleton key={i} />
				))}
			</div>
		</div>
	</section>
);
// end of featured products skeleton

export default Homepage
