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

// one input style for the whole form
const inputClass =
	"block h-11 w-full rounded-lg border border-[#D9D6D2] bg-white px-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

const Field = ({ label, id, className = "", children }) => (
	<div className={className}>
		<label htmlFor={id} className='mb-1.5 block text-[13px] font-semibold text-ink'>
			{label}
		</label>
		{children}
	</div>
);

const AddressCard = () => {
	const { shippingAddress, setShippingField } = useCheckoutStore();

	return (
		<div className='rounded-xl border border-line bg-white p-5 sm:p-6'>
			<h2 className='mb-5 font-display text-xl font-bold text-ink'>Delivery address</h2>

			<div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2'>
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

				<Field label='Street address' id='street' className='sm:col-span-2'>
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
	);
};

export default AddressCard;
