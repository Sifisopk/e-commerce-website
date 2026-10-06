import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, MapPin } from "lucide-react";
import axios from "../lib/axios";

const STEPS = [
	{ key: "pending", label: "Order placed", icon: Clock },
	{ key: "processing", label: "Processing", icon: Package },
	{ key: "shipped", label: "Shipped", icon: Truck },
	{ key: "out_for_delivery", label: "Out for delivery", icon: Truck },
	{ key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const TrackOrderPage = () => {
	const [orderNumber, setOrderNumber] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [order, setOrder] = useState(null);
	const [error, setError] = useState(null);

	// start of handleSubmit
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setOrder(null);

		try {
			const res = await axios.post("/orders/track", { orderNumber, email });
			setOrder(res.data);
		} catch (err) {
			setError(err.response?.data?.message || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	// end of handleSubmit

	const isCancelled = order?.status === "cancelled";
	const currentStepIndex = STEPS.findIndex((s) => s.key === order?.status);

	return (
		<div className='min-h-screen bg-white'>
			<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2'>Track your order</h1>
				<p className='text-gray-500 text-center mb-8'>
					Enter your order number and the email you used at checkout.
				</p>

				{/* start of search form */}
				<form onSubmit={handleSubmit} className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4'>
					<div>
						<label htmlFor='orderNumber' className='block text-sm font-medium text-gray-700 mb-1'>
							Order number
						</label>
						<input
							id='orderNumber'
							type='text'
							value={orderNumber}
							onChange={(e) => setOrderNumber(e.target.value)}
							placeholder='SFB-XXXXXX'
							className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500 uppercase'
							required
						/>
					</div>

					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
							Email address
						</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='you@example.com'
							className='block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
							required
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50'
					>
						<Search size={18} className='mr-2' />
						{isLoading ? "Searching..." : "Track Order"}
					</button>
				</form>
				{/* end of search form */}

				{error && (
					<p className='mt-4 text-center text-sm text-red-600'>{error}</p>
				)}

				{/* start of result */}
				{order && (
					<motion.div
						className='mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className='flex flex-wrap items-start justify-between gap-2 mb-6'>
							<div>
								<p className='text-sm text-gray-500'>Order #{order.orderNumber}</p>
								<p className='text-xs text-gray-400'>
									Placed {new Date(order.createdAt).toLocaleDateString()}
								</p>
							</div>
							<p className='text-lg font-bold text-gray-900'>R{order.totalAmount.toFixed(2)}</p>
						</div>

						{/* start of status timeline */}
						{isCancelled ? (
							<div className='flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-4 mb-6'>
								<XCircle className='h-5 w-5 text-red-600 shrink-0' />
								<p className='text-sm text-red-700'>This order has been cancelled.</p>
							</div>
						) : (
							<div className='mb-6'>
								<div className='flex items-center justify-between'>
									{STEPS.map((step, index) => {
										const Icon = step.icon;
										const isDone = index <= currentStepIndex;
										return (
											<div key={step.key} className='flex flex-col items-center flex-1'>
												<div className='flex items-center w-full'>
													{index > 0 && (
														<div className={`h-0.5 flex-1 ${index <= currentStepIndex ? "bg-red-600" : "bg-gray-200"}`} />
													)}
													<div
														className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
															isDone ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400"
														}`}
													>
														<Icon size={16} />
													</div>
													{index < STEPS.length - 1 && (
														<div className={`h-0.5 flex-1 ${index < currentStepIndex ? "bg-red-600" : "bg-gray-200"}`} />
													)}
												</div>
												<p className={`mt-2 text-[11px] sm:text-xs text-center ${isDone ? "text-gray-900 font-medium" : "text-gray-400"}`}>
													{step.label}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						)}
						{/* end of status timeline */}

						<div className='space-y-3 mb-6 border-t border-gray-200 pt-4'>
							{order.products.map((item, idx) => {
								const itemName = item.name || item.product?.name || "Product removed";
								const itemImage = item.image || item.product?.images?.[0];
								return (
									<div key={idx} className='flex items-center gap-3 text-sm text-gray-700'>
										{itemImage && (
											<img src={itemImage} alt={itemName} className='h-12 w-12 rounded object-cover' />
										)}
										<div>
											<p className='font-medium text-gray-900'>{itemName}</p>
											<p className='text-gray-500 text-xs'>
												Qty {item.quantity}
												{item.color && ` · ${item.color}`}
												{item.size && ` · Size ${item.size}`}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{order.shippingAddress?.street && (
							<div className='flex items-start gap-2 rounded-md bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600'>
								<MapPin className='h-4 w-4 text-gray-400 mt-0.5 shrink-0' />
								<div>
									<p>{order.shippingAddress.fullName}</p>
									<p>{order.shippingAddress.street}, {order.shippingAddress.suburb}</p>
									<p>{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}</p>
								</div>
							</div>
						)}
					</motion.div>
				)}
				{/* end of result */}
			</div>
		</div>
	);
};

export default TrackOrderPage;