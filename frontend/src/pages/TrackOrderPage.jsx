import { useState } from "react";
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, MapPin, Mail } from "lucide-react";
import axios from "../lib/axios";
import ContactSupport from "../components/ContactSupport";
import AuthField from "../components/AuthField";
import AuthSubmit from "../components/AuthSubmit";

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
		<div className='min-h-[70vh] bg-white'>
			<div className='mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14'>
				<h1 className='mb-2 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl'>Track your order</h1>
				<p className='mb-8 text-center text-muted'>Enter your order number and the email you used at checkout.</p>

				{/* start of search form */}
				<form onSubmit={handleSubmit} className='space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm'>
					<AuthField
						id='orderNumber'
						label='Order number'
						value={orderNumber}
						onChange={(e) => setOrderNumber(e.target.value)}
						placeholder='SFB-XXXXXX'
						inputClassName='uppercase'
					/>
					<AuthField
						id='email'
						label='Email address'
						icon={Mail}
						type='email'
						autoComplete='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='you@example.com'
					/>
					<AuthSubmit loading={isLoading} loadingText='Searching...' icon={Search}>
						Track order
					</AuthSubmit>
				</form>
				{/* end of search form */}

				{error && <p className='mt-4 text-center text-sm font-medium text-brand'>{error}</p>}

				{/* start of result */}
				{order && (
					<div className='mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6'>
						<div className='mb-6 flex flex-wrap items-start justify-between gap-2'>
							<div>
								<p className='font-semibold text-ink'>Order #{order.orderNumber}</p>
								<p className='text-xs text-muted'>Placed {new Date(order.createdAt).toLocaleDateString()}</p>
							</div>
							<p className='text-lg font-bold text-ink'>R{order.totalAmount.toFixed(2)}</p>
						</div>

						{/* start of status timeline */}
						{isCancelled ? (
							<div className='mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4'>
								<XCircle className='h-5 w-5 shrink-0 text-brand' />
								<p className='text-sm text-red-800'>This order has been cancelled.</p>
							</div>
						) : (
							<div className='mb-6 flex items-start justify-between'>
								{STEPS.map((step, index) => {
									const Icon = step.icon;
									const isDone = index <= currentStepIndex;
									return (
										<div key={step.key} className='flex flex-1 flex-col items-center'>
											<div className='flex w-full items-center'>
												{index > 0 && (
													<div className={`h-0.5 flex-1 ${index <= currentStepIndex ? "bg-brand" : "bg-line"}`} />
												)}
												<div
													className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
														isDone ? "bg-brand text-white" : "bg-surface text-gray-400"
													}`}
												>
													<Icon size={16} />
												</div>
												{index < STEPS.length - 1 && (
													<div className={`h-0.5 flex-1 ${index < currentStepIndex ? "bg-brand" : "bg-line"}`} />
												)}
											</div>
											<p
												className={`mt-2 px-0.5 text-center text-[11px] leading-tight sm:text-xs ${
													isDone ? "font-medium text-ink" : "text-muted"
												}`}
											>
												{step.label}
											</p>
										</div>
									);
								})}
							</div>
						)}
						{/* end of status timeline */}

						<div className='mb-6 space-y-3 border-t border-line pt-4'>
							{order.products.map((item, idx) => {
								const itemName = item.name || item.product?.name || "Product removed";
								const itemImage = item.image || item.product?.images?.[0];
								return (
									<div key={idx} className='flex items-center gap-3 text-sm'>
										{itemImage && (
											<img src={itemImage} alt={itemName} className='h-14 w-14 rounded-lg bg-surface object-cover' />
										)}
										<div>
											<p className='font-medium text-ink'>{itemName}</p>
											<p className='text-xs text-muted'>
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
							<div className='flex items-start gap-2 rounded-lg bg-surface p-3 text-sm text-muted'>
								<MapPin className='mt-0.5 h-4 w-4 shrink-0' />
								<div>
									<p className='text-ink'>{order.shippingAddress.fullName}</p>
									<p>
										{order.shippingAddress.street}, {order.shippingAddress.suburb}
									</p>
									<p>
										{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
				{/* end of result */}

				{/* start of contact support */}
				<ContactSupport
					className='mt-8'
					orderNumber={order?.orderNumber}
					message={
						order
							? "Something not right with this order? Get in touch."
							: "Can't find your order? Wrong email on file? Contact us with your order number."
					}
				/>
				{/* end of contact support */}
			</div>
		</div>
	);
};

export default TrackOrderPage;
