import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

// The one product card used everywhere (categories, featured, cart suggestions)
const ProductCard = ({product}) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();

	const hasOptions = product.colors?.length > 0 || product.sizes?.length > 0;

    const handleAddToCart = () => {
		// start of send shopper to pick size/colour first
		if (hasOptions) {
			navigate(`/product/${product._id}`);
			return;
		}
		// end of send shopper to pick size/colour first

		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}

		addToCart(product);
	};

  return (
   <div className='group mx-auto flex h-full w-full max-w-[280px] flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 hover:shadow-md'>
			<Link to={`/product/${product._id}`} className='block overflow-hidden bg-surface'>
				<img
					className='aspect-[5/5] w-full object-cover transition-transform duration-300 group-hover:scale-105'
					src={product.images?.[0]}
					alt={product.name}
					loading='lazy'
				/>
			</Link>

			<div className='flex flex-1 flex-col p-2 sm:p-4'>
				<Link to={`/product/${product._id}`}>
					<h3 className='text-base font-semibold leading-snug text-ink transition-colors hover:text-brand sm:text-lg'>
						{product.name}
					</h3>
				</Link>
				<p className='mb-4 mt-1 text-lg font-bold text-brand sm:text-xl'>R{product.price}</p>
				<button
					className='mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={18} />
					{hasOptions ? "View details" : "Add to cart"}
				</button>
			</div>
		</div>
  ); 
}

export default ProductCard
