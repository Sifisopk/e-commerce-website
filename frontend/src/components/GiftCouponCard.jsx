import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

// Only shown when COUPONS_ENABLED is true in config/features.js
const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied,applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<div className='space-y-4 rounded-xl border border-line bg-white p-5 sm:p-6'>
			<div>
				<label htmlFor='voucher' className='mb-1.5 block text-[13px] font-semibold text-ink'>
					Do you have a voucher or gift card?
				</label>
				<input
					type='text'
					id='voucher'
					className='block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
					placeholder='Enter code here'
					value={userInputCode}
					onChange={(e) => setUserInputCode(e.target.value)}
				/>
			</div>

			<button
				type='button'
				className='flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-red-200'
				onClick={handleApplyCoupon}
			>
				Apply code
			</button>

			{isCouponApplied && coupon && (
				<div>
					<h3 className='font-semibold text-ink'>Applied coupon</h3>
					<p className='mt-1 text-sm text-muted'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
					<button
						type='button'
						className='mt-3 flex h-11 w-full items-center justify-center rounded-lg border border-ink text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
						onClick={handleRemoveCoupon}
					>
						Remove coupon
					</button>
				</div>
			)}

			{coupon && (
				<div>
					<h3 className='font-semibold text-ink'>Your available coupon</h3>
					<p className='mt-1 text-sm text-muted'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</div>
	);
};
export default GiftCouponCard;
