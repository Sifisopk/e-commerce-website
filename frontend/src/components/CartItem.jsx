import { Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";

const stepperButton =
	"flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:border-ink focus:outline-none focus:ring-2 focus:ring-brand";

const CartItem = ({ item }) => {
 const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='flex gap-4 rounded-xl border border-line bg-white p-4 sm:gap-5 sm:p-5'>
			<Link to={`/product/${item._id}`} className='block h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-36 sm:w-28'>
				<img className='h-full w-full object-cover' src={item.images?.[0]} alt={item.name} />
			</Link>

			<div className='flex min-w-0 flex-1 flex-col justify-between gap-3'>
				<div>
					<div className='flex items-start justify-between gap-3'>
						<Link to={`/product/${item._id}`}>
							<p className='font-semibold leading-snug text-ink transition-colors hover:text-brand sm:text-lg'>
								{item.name}
							</p>
						</Link>
						<p className='shrink-0 font-bold text-ink'>R{item.price}</p>
					</div>

					{/* start of colour and size */}
					{(item.color || item.size) && (
						<p className='mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-muted'>
							{item.color && (
								<span className='flex items-center gap-1.5 capitalize'>
									<span
										className='inline-block h-3.5 w-3.5 rounded-full border border-line'
										style={{ backgroundColor: item.color.toLowerCase() }}
									/>
									{item.color}
								</span>
							)}
							{item.color && item.size && <span>·</span>}
							{item.size && <span className='uppercase'>Size {item.size}</span>}
						</p>
					)}
					{/* end of colour and size */}
				</div>

				<div className='flex items-center gap-3'>
					<button
						className={stepperButton}
						aria-label='Decrease quantity'
						onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
					>
						<Minus size={16} />
					</button>
					<span className='min-w-[1.25rem] text-center font-semibold text-ink'>{item.quantity}</span>
					<button
						className={stepperButton}
						aria-label='Increase quantity'
						onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
					>
						<Plus size={16} />
					</button>

					<button
						className='ml-auto text-sm text-muted underline transition-colors hover:text-brand'
						onClick={() => removeFromCart(item.cartItemId)}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}

export default CartItem
