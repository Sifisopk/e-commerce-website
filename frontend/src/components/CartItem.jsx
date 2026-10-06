import { Minus, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
 const { removeFromCart, updateQuantity } = useCartStore();

 
	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-200 bg-white md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<Link to={`/product/${item._id}`}>
						<img className='h-20 md:h-32 rounded object-cover' src={item.images?.[0]} />
					</Link>
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
							  focus:ring-red-400'
							onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
						>
							<Minus className='text-gray-700' />
						</button>
						<p className='text-gray-900'>{item.quantity}</p>
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none 
						focus:ring-2 focus:ring-red-400'
							onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
						>
							<Plus className='text-gray-700' />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-red-600'>R{item.price}</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<Link to={`/product/${item._id}`}>
						<p className='text-base font-medium text-gray-900 hover:text-red-600 hover:underline'>
							{item.name}
						</p>
					</Link>
					{(item.color || item.size) && (
						<p className='text-sm text-gray-600 flex items-center gap-2'>
							{item.color && (
								<span className='flex items-center gap-1.5 capitalize'>
									<span
										className='inline-block h-3.5 w-3.5 rounded-full border border-gray-300'
										style={{ backgroundColor: item.color.toLowerCase() }}
									/>
									{item.color}
								</span>
							)}
							{item.color && item.size && <span>·</span>}
							{item.size && <span className='uppercase'>Size: {item.size}</span>}
						</p>
					)}
					<p className='text-sm text-gray-500'>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-600
							 hover:text-red-700 hover:underline'
							onClick={() => removeFromCart(item.cartItemId)}
						>
							<Trash />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartItem