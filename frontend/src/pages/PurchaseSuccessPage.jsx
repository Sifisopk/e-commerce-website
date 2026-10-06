import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

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

	if (isProcessing) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-white'>
				<div className='relative'>
					<div className='w-16 h-16 border-red-200 border-2 rounded-full' />
					<div className='w-16 h-16 border-red-600 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-white px-4'>
				<p className='text-gray-600 text-center'>{error}</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center px-4 bg-white'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
				colors={["#DC2626", "#F87171", "#1F2937", "#FFFFFF"]}
			/>

			<div className='max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-red-600 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-600 text-center mb-2'>
						Thank you for your order. {"We will"} process it soon.
					</p>
					<p className='text-red-600 text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					<div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-500'>Order number</span>
							<span className='text-sm font-semibold text-gray-900'>#{orderNumber}</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-500'>Estimated delivery</span>
							<span className='text-sm font-semibold text-gray-900'>5-10 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/"}
							className='w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;