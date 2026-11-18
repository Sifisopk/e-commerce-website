import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import { COUPONS_ENABLED } from "../config/features";
import { Link } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const { shippingAddress, getAddressError } = useCheckoutStore();
	const [isProcessing, setIsProcessing] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	// start of handlePayment
	const handlePayment = async () => {
		if (isProcessing) return;

		const addressError = getAddressError();
		if (addressError) {
			toast.error(addressError, { id: "address" });
			return;
		}

		setIsProcessing(true);
		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: COUPONS_ENABLED && coupon && isCouponApplied ? coupon.code : null,
				shippingAddress,
			});

			const session = res.data;
			if (!session?.url) {
				toast.error("Something went wrong starting checkout");
				return;
			}
			window.location.href = session.url;
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong starting checkout");
		} finally {
			setIsProcessing(false);
		}
	};
	// end of handlePayment

	return (
		<div className='rounded-xl bg-surface p-5 sm:p-6'>
			<h2 className='mb-4 font-display text-xl font-bold text-ink'>Order summary</h2>

			<dl className='space-y-2.5 text-[15px]'>
				<div className='flex items-center justify-between gap-4'>
					<dt className='text-muted'>Subtotal</dt>
					<dd className='font-medium text-ink'>R{formattedSubtotal}</dd>
				</div>

				{savings > 0 && (
					<div className='flex items-center justify-between gap-4'>
						<dt className='text-muted'>Savings</dt>
						<dd className='font-medium text-brand'>-R{formattedSavings}</dd>
					</div>
				)}

				{coupon && isCouponApplied && (
					<div className='flex items-center justify-between gap-4'>
						<dt className='text-muted'>Coupon ({coupon.code})</dt>
						<dd className='font-medium text-brand'>-{coupon.discountPercentage}%</dd>
					</div>
				)}
			</dl>

			<div className='mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-lg font-bold text-ink'>
				<span>Total</span>
				<span>R{formattedTotal}</span>
			</div>

			<button
				className='mt-5 flex h-14 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50'
				onClick={handlePayment}
				disabled={isProcessing}
			>
				{isProcessing ? "Processing..." : "Proceed to Checkout"}
			</button>

			<p className='mt-3 text-center text-[13px] text-muted'>Secure payment via Paystack</p>

			<p className='mt-4 text-center text-sm text-muted'>
				or{" "}
				<Link to='/' className='font-medium text-brand underline hover:text-brand-dark hover:no-underline'>
					Continue shopping →
				</Link>
			</p>
		</div>
	);
};
export default OrderSummary;
