import { CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import ContactSupport from "../components/ContactSupport";
import LoadingSpinner from "../components/LoadingSpinner";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);
	const [orderNumber, setOrderNumber] = useState(null);
	const hasProcessed = useRef(false);

	useEffect(() => {
		// start of once-only guard (dev mode runs effects twice)
		if (hasProcessed.current) return;
		hasProcessed.current = true;
		// end of once-only guard

		const handleCheckoutSuccess = async (reference) => {
			try {
				const response = await axios.post("/payments/checkout-success", { reference });
				setOrderNumber(response.data.orderNumber);
				clearCart();
			} catch (error) {
				console.log(error);
				setError(
					error.response?.data?.message ||
						"We couldn't confirm your order. Please contact support."
				);
			} finally {
				setIsProcessing(false);
			}
		};

		const reference = new URLSearchParams(window.location.search).get("reference");
		if (reference) {
			handleCheckoutSuccess(reference);
		} else {
			setIsProcessing(false);
			setError("No payment reference found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) return <LoadingSpinner />;

	if (error) {
		return (
			<div className='flex min-h-[70vh] items-center justify-center px-4 py-10'>
				<div className='w-full max-w-md space-y-4'>
					<p className='text-center text-muted'>{error}</p>
					<ContactSupport message="If you were charged, contact us and we'll sort it out." />
				</div>
			</div>
		);
	}

	return (
		<div className='flex min-h-[70vh] items-center justify-center px-4 py-10'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
				colors={["#D4121A", "#F87171", "#111111", "#FFFFFF"]}
			/>

			<div className='relative z-10 w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lg sm:p-8'>
				<CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-600' />
				<h1 className='mb-2 text-center font-display text-3xl font-bold tracking-tight text-ink'>Purchase successful!</h1>

				<p className='mb-2 text-center text-muted'>Thank you for your order. We will process it soon.</p>
				<p className='mb-6 text-center text-sm font-medium text-brand'>
					Check your email inbox or spam folder for order details and updates.
				</p>

				<div className='mb-6 space-y-2 rounded-xl bg-surface p-4'>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted'>Order number</span>
						<span className='text-sm font-semibold text-ink'>#{orderNumber}</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted'>Estimated delivery</span>
						<span className='text-sm font-semibold text-ink'>5-10 business days</span>
					</div>
				</div>

				<ContactSupport
					className='mb-6'
					orderNumber={orderNumber}
					message="Haven't received your confirmation email? Keep your order number and contact us."
				/>

				<div className='space-y-3'>
					<Link
						to='/track-order'
						className='flex h-12 w-full items-center justify-center rounded-lg bg-brand font-semibold text-white transition-colors hover:bg-brand-dark'
					>
						Track your order
					</Link>
					<Link
						to='/'
						className='flex h-12 w-full items-center justify-center rounded-lg border border-ink font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
					>
						Continue shopping
					</Link>
				</div>

				<p className='mt-5 flex items-center justify-center gap-2 text-sm text-muted'>
					<HandHeart size={16} />
					Thanks for trusting us!
				</p>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
