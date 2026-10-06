import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useCheckoutStore } from "../stores/useCheckoutStore";

const PROVINCES = [
	"Eastern Cape",
	"Free State",
	"Gauteng",
	"KwaZulu-Natal",
	"Limpopo",
	"Mpumalanga",
	"North West",
	"Northern Cape",
	"Western Cape",
];

const inputClass =
	"block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500";

const Field = ({ label, id, children }) => (
	<div>
		<label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-700'>
			{label}
		</label>
		{children}
	</div>
);

const AddressCard = () => {
	const { shippingAddress, setShippingField } = useCheckoutStore();

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex items-center gap-2'>
				<MapPin className='h-5 w-5 text-red-600' />
				<h3 className='text-xl font-semibold text-gray-900'>Delivery address</h3>
			</div>

			<div className='space-y-3'>
				<Field label='Full name' id='fullName'>
					<input
						id='fullName'
						type='text'
						autoComplete='name'
						maxLength={60}
						className={inputClass}
						placeholder='John Doe'
						value={shippingAddress.fullName}
						onChange={(e) => setShippingField("fullName", e.target.value)}
					/>
				</Field>

				<Field label='Phone number' id='phone'>
					<input
						id='phone'
						type='tel'
						autoComplete='tel'
						maxLength={20}
						className={inputClass}
						placeholder='082 123 4567'
						value={shippingAddress.phone}
						onChange={(e) => setShippingField("phone", e.target.value)}
					/>
				</Field>

				<Field label='Street address' id='street'>
					<input
						id='street'
						type='text'
						autoComplete='address-line1'
						maxLength={100}
						className={inputClass}
						placeholder='12 Main Road'
						value={shippingAddress.street}
						onChange={(e) => setShippingField("street", e.target.value)}
					/>
				</Field>

				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<Field label='Suburb' id='suburb'>
						<input
							id='suburb'
							type='text'
							autoComplete='address-line2'
							maxLength={50}
							className={inputClass}
							value={shippingAddress.suburb}
							onChange={(e) => setShippingField("suburb", e.target.value)}
						/>
					</Field>

					<Field label='City / Town' id='city'>
						<input
							id='city'
							type='text'
							autoComplete='address-level2'
							maxLength={50}
							className={inputClass}
							value={shippingAddress.city}
							onChange={(e) => setShippingField("city", e.target.value)}
						/>
					</Field>
				</div>

				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<Field label='Province' id='province'>
						<select
							id='province'
							autoComplete='address-level1'
							className={inputClass}
							value={shippingAddress.province}
							onChange={(e) => setShippingField("province", e.target.value)}
						>
							<option value=''>Select province</option>
							{PROVINCES.map((province) => (
								<option key={province} value={province}>
									{province}
								</option>
							))}
						</select>
					</Field>

					<Field label='Postal code' id='postalCode'>
						<input
							id='postalCode'
							type='text'
							inputMode='numeric'
							autoComplete='postal-code'
							maxLength={4}
							className={inputClass}
							placeholder='2000'
							value={shippingAddress.postalCode}
							onChange={(e) => setShippingField("postalCode", e.target.value.replace(/\D/g, ""))}
						/>
					</Field>
				</div>
			</div>
		</motion.div>
	);
};

export default AddressCard;