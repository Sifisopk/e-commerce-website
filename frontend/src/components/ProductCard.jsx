import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({product}) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();

	const hasOptions = product.colors?.length > 0 || product.sizes?.length > 0;

    const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}

		// start of send shopper to pick size/colour first
		if (hasOptions) {
			toast("Please choose your size and colour first", { id: "options" });
			navigate(`/product/${product._id}`);
			return;
		}
		// end of send shopper to pick size/colour first

		addToCart(product);
	};

  return (
   <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
			<Link to={`/product/${product._id}`}>
				<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl bg-gray-100'>
					<img className='object-cover w-full' src={product.images?.[0]} alt='product image' />
				</div>
			</Link>

			<div className='mt-4 px-5 pb-5'>
				<Link to={`/product/${product._id}`}>
					<h5 className='text-xl font-semibold tracking-tight text-gray-900 hover:text-red-600'>{product.name}</h5>
				</Link>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-red-600'>R{product.price}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-colors duration-200'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					{hasOptions ? "Select options" : "Add to cart"}
				</button>
			</div>
		</div>
  ); 
}

export default ProductCard