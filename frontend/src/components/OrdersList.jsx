import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";

const STATUS_OPTIONS = [
	{ value: "pending", label: "Pending" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "out_for_delivery", label: "Out for delivery" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

// start of status badge colors
const STATUS_COLORS = {
	pending: "bg-gray-100 text-gray-700",
	processing: "bg-yellow-100 text-yellow-700",
	shipped: "bg-blue-100 text-blue-700",
	out_for_delivery: "bg-purple-100 text-purple-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};
// end of status badge colors

// older orders have no orderNumber, so fall back to the last 6 characters of the id
const displayOrderNumber = (order) => order.orderNumber || order._id.slice(-6).toUpperCase();

const OrdersList = () => {
	const { orders, loading, fetchAllOrders, updateOrderStatus } = useOrderStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	useEffect(() => {
		fetchAllOrders();
	}, [fetchAllOrders]);

	// start of filter orders
	const filteredOrders = useMemo(() => {
		const query = searchTerm.trim().replace(/^#/, "").toLowerCase();

		return orders.filter((order) => {
			if (statusFilter !== "all" && order.status !== statusFilter) return false;
			if (!query) return true;

			const searchable = [displayOrderNumber(order), order._id, order.user?.name, order.user?.email]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return searchable.includes(query);
		});
	}, [orders, searchTerm, statusFilter]);
	// end of filter orders

	const clearFilters = () => {
		setSearchTerm("");
		setStatusFilter("all");
	};

	if (loading) {
		return (
			<div className='max-w-5xl mx-auto space-y-4 animate-pulse'>
				{[...Array(3)].map((_, i) => (
					<div key={i} className='h-24 bg-gray-100 rounded-lg border border-gray-200' />
				))}
			</div>
		);
	}

	if (orders.length === 0) {
		return <p className='text-center text-gray-500'>No orders yet.</p>;
	}

	return (
		<motion.div
			className='max-w-5xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* start of search and filter bar */}
			<div className='mb-3 flex flex-col gap-3 sm:flex-row'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='Search by order number, name or email'
						className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
					/>
					{searchTerm && (
						<button
							type='button'
							onClick={() => setSearchTerm("")}
							aria-label='Clear search'
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
						>
							<X className='h-4 w-4' />
						</button>
					)}
				</div>

				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className='rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
				>
					<option value='all'>All statuses</option>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<p className='mb-4 text-sm text-gray-500'>
				Showing {filteredOrders.length} of {orders.length} orders
			</p>
			{/* end of search and filter bar */}

			{/* start of no results */}
			{filteredOrders.length === 0 && (
				<div className='rounded-lg border border-gray-200 bg-white p-8 text-center'>
					<p className='text-gray-600'>No orders match your search.</p>
					<button
						type='button'
						onClick={clearFilters}
						className='mt-3 text-sm font-medium text-red-600 hover:text-red-700'
					>
						Clear search and filters
					</button>
				</div>
			)}
			{/* end of no results */}

			<div className='space-y-4'>
				{filteredOrders.map((order) => (
					<div key={order._id} className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6'>
						<div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
							<div>
								<p className='text-sm text-gray-500'>Order #{displayOrderNumber(order)}</p>
								<p className='text-sm text-gray-700'>{order.user?.name} · {order.user?.email}</p>
								<p className='text-xs text-gray-400 mt-1'>
									{new Date(order.createdAt).toLocaleDateString()}
								</p>
							</div>
							<div className='text-right'>
								<p className='text-lg font-bold text-gray-900'>R{order.totalAmount.toFixed(2)}</p>
								<span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
									{order.status.replace(/_/g, " ")}
								</span>
							</div>
						</div>

						<div className='space-y-3 mb-4'>
							{order.products.map((item, idx) => {
								// start of snapshot first, live lookup as fallback
								const itemName = item.name || item.product?.name || "Product removed";
								const itemImage = item.image || item.product?.images?.[0];
								// end of snapshot first, live lookup as fallback

								return (
									<div key={idx} className='flex items-center gap-3 text-sm text-gray-700'>
										{itemImage && (
											<img src={itemImage} alt={itemName} className='h-12 w-12 rounded object-cover' />
										)}
										<div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
											<span className='font-medium text-gray-900'>{itemName}</span>
											<span className='text-gray-400'>× {item.quantity}</span>

											{/* start of colour and size */}
											{item.color && (
												<span className='inline-flex items-center gap-1.5 text-xs text-gray-600 capitalize'>
													<span
														className='inline-block h-3.5 w-3.5 rounded-full border border-gray-300'
														style={{ backgroundColor: item.color.toLowerCase() }}
													/>
													{item.color}
												</span>
											)}
											{item.size && (
												<span className='px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-700 uppercase'>
													Size {item.size}
												</span>
											)}
											{/* end of colour and size */}
										</div>
									</div>
								);
							})}
						</div>

						{/* start of delivery address */}
						{order.shippingAddress?.street && (
							<div className='mb-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600'>
								<p className='font-medium text-gray-700 mb-1'>Deliver to</p>
								<p>{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
								<p>{order.shippingAddress.street}, {order.shippingAddress.suburb}</p>
								<p>
									{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}
								</p>
							</div>
						)}
						{/* end of delivery address */}

						<div className='flex items-center gap-2'>
							<label className='text-sm text-gray-600'>Update status:</label>
							<select
								value={order.status}
								onChange={(e) => updateOrderStatus(order._id, e.target.value)}
								className='text-sm border border-gray-300 rounded-md py-1.5 px-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
							>
								{STATUS_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default OrdersList;