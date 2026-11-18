import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const gridClass = "mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data);
			} catch (error) {
				toast.error(error.response?.data?.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (!isLoading && recommendations.length === 0) return null;

	return (
		<section className='mt-14'>
			<h2 className='font-display text-2xl font-bold tracking-tight sm:text-3xl'>You may also like</h2>
			<div className={gridClass}>
				{isLoading
					? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
					: recommendations.map((product) => <ProductCard key={product._id} product={product} />)}
			</div>
		</section>
	);
};
export default PeopleAlsoBought;
