import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart } from "lucide-react";
import OrderSummary from "../components/OrderSummary";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import GiftCouponCard from "../components/GiftCouponCard";
import AddressCard from "../components/AddressCard";
import VerifyEmailBanner from "../components/VerifyEmailBanner";
import { COUPONS_ENABLED } from "../config/features";


const CartPage = () => {
const {cart} = useCartStore();

	return (
		<div className='min-h-[70vh] bg-white'>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
				<VerifyEmailBanner />

				<h1 className='mb-8 font-display text-3xl font-bold tracking-tight sm:text-4xl'>
					Your cart
					{cart.length > 0 && <span className='ml-2 text-xl font-medium text-muted'>({cart.length})</span>}
				</h1>

				{cart.length === 0 ? (
					<EmptyCartUI />
				) : (
					<>
						<div className='grid items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10'>
							{/* start of items */}
							<div className='space-y-4'>
								{cart.map((item) => (
									<CartItem key={item.cartItemId} item={item} />
								))}
							</div>
							{/* end of items */}

							{/* start of address and summary (address first, so it is filled in before checkout) */}
							<div className='space-y-5'>
								<AddressCard />
								<OrderSummary />
								{COUPONS_ENABLED && <GiftCouponCard />}
							</div>
							{/* end of address and summary */}
						</div>

						<PeopleAlsoBought />
					</>
				)}
			</div>
		</div>
	);
};
export default CartPage;

const EmptyCartUI = () => (
	<div className='flex flex-col items-center justify-center space-y-4 py-16 text-center'>
		<ShoppingCart className='h-20 w-20 text-gray-300' />
		<h2 className='font-display text-2xl font-bold text-ink'>Your cart is empty</h2>
		<p className='text-muted'>Looks like you {"haven't"} added anything to your cart yet.</p>
		<Link
			className='mt-2 rounded-lg bg-brand px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark'
			to='/'
		>
			Start shopping
		</Link>
	</div>
);
