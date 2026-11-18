import { useEffect, useMemo, useState } from "react";
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

// start of status badge colors (these stay colourful on purpose: colour = meaning)
const STATUS_COLORS = {
	pending: "bg-gray-100 text-gray-700",
	processing: "bg-yellow-100 text-yellow-700",
	shipped: "bg-blue-100 text-blue-700",
	out_for_delivery: "bg-purple-100 text-purple-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};
// end of status badge colors

const selectClass =
	"rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

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

	if (loading && orders.length === 0) {
		return (
			<div className='mx-auto max-w-5xl animate-pulse space-y-4'>
				{[...Array(3)].map((_, i) => (
					<div key={i} className='h-32 rounded-xl border border-line bg-surface' />
				))}
			</div>
		);
	}

	if (orders.length === 0) {
		return <p className='text-center text-muted'>No orders yet.</p>;
	}

	return (
		<div className='mx-auto max-w-5xl'>
			{/* start of search and filter bar */}
			<div className='mb-3 flex flex-col gap-3 sm:flex-row'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='Search by order number, name or email'
						className='h-11 w-full rounded-lg border border-[#D9D6D2] bg-white pl-10 pr-10 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
					/>
					{searchTerm && (
						<button
							type='button'
							onClick={() => setSearchTerm("")}
							aria-label='Clear search'
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink'
						>
							<X className='h-4 w-4' />
						</button>
					)}
				</div>

				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					aria-label='Filter by status'
					className={`h-11 ${selectClass}`}
				>
					<option value='all'>All statuses</option>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<p className='mb-4 text-sm text-muted'>
				Showing {filteredOrders.length} of {orders.length} orders
			</p>
			{/* end of search and filter bar */}

			{/* start of no results */}
			{filteredOrders.length === 0 && (
				<div className='rounded-xl border border-line bg-white p-8 text-center'>
					<p className='text-muted'>No orders match your search.</p>
					<button
						type='button'
						onClick={clearFilters}
						className='mt-3 text-sm font-medium text-brand hover:text-brand-dark'
					>
						Clear search and filters
					</button>
				</div>
			)}
			{/* end of no results */}

			<div className='space-y-4'>
				{filteredOrders.map((order) => (
					<div key={order._id} className='rounded-xl border border-line bg-white p-4 sm:p-6'>
						<div className='mb-4 flex flex-wrap items-start justify-between gap-4'>
							<div className='min-w-0'>
								<p className='font-semibold text-ink'>Order #{displayOrderNumber(order)}</p>
								<p className='break-all text-sm text-muted'>
									{order.user?.name || "Customer"}
									{order.user?.email && ` · ${order.user.email}`}
								</p>
								<p className='mt-1 text-xs text-muted'>
									{new Date(order.createdAt).toLocaleDateString("en-ZA", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</p>
							</div>
							<div className='text-right'>
								<p className='text-lg font-bold text-ink'>R{order.totalAmount.toFixed(2)}</p>
								<span
									className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}
								>
									{order.status.replace(/_/g, " ")}
								</span>
							</div>
						</div>

						<div className='mb-4 space-y-3'>
							{order.products.map((item, idx) => {
								// start of snapshot first, live lookup as fallback
								const itemName = item.name || item.product?.name || "Product removed";
								const itemImage = item.image || item.product?.images?.[0];
								// end of snapshot first, live lookup as fallback

								return (
									<div key={idx} className='flex items-center gap-3 text-sm'>
										{itemImage && (
											<img src={itemImage} alt={itemName} className='h-12 w-12 shrink-0 rounded-lg bg-surface object-cover' />
										)}
										<div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
											<span className='font-medium text-ink'>{itemName}</span>
											<span className='text-muted'>× {item.quantity}</span>

											{/* start of colour and size */}
											{item.color && (
												<span className='inline-flex items-center gap-1.5 text-xs capitalize text-muted'>
													<span
														className='inline-block h-3.5 w-3.5 rounded-full border border-line'
														style={{ backgroundColor: item.color.toLowerCase() }}
													/>
													{item.color}
												</span>
											)}
											{item.size && (
												<span className='rounded bg-surface px-2 py-0.5 text-xs font-medium uppercase text-ink'>
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
							<div className='mb-4 rounded-lg bg-surface p-3 text-sm text-muted'>
								<p className='mb-1 font-medium text-ink'>Deliver to</p>
								<p>
									{order.shippingAddress.fullName} · {order.shippingAddress.phone}
								</p>
								<p>
									{order.shippingAddress.street}, {order.shippingAddress.suburb}
								</p>
								<p>
									{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}
								</p>
							</div>
						)}
						{/* end of delivery address */}

						<div className='flex items-center gap-2'>
							<label htmlFor={`status-${order._id}`} className='text-sm text-muted'>
								Update status:
							</label>
							<select
								id={`status-${order._id}`}
								value={order.status}
								onChange={(e) => updateOrderStatus(order._id, e.target.value)}
								className={`h-10 ${selectClass}`}
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
		</div>
	);
};

export default OrdersList;
