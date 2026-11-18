// One labelled input (optional icon). Used by every auth form and the track-order form.
const AuthField = ({
	id,
	label,
	icon: Icon,
	type = "text",
	value,
	onChange,
	placeholder,
	required = true,
	minLength,
	autoComplete,
	inputClassName = "",
	children,
}) => (
	<div>
		<label htmlFor={id} className='mb-1.5 block text-sm font-medium text-ink'>
			{label}
		</label>
		<div className='relative'>
			{Icon && (
				<Icon
					className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400'
					aria-hidden='true'
				/>
			)}
			<input
				id={id}
				type={type}
				required={required}
				minLength={minLength}
				autoComplete={autoComplete}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={`block h-12 w-full rounded-lg border border-[#D9D6D2] bg-white pr-3 text-sm text-ink placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${
					Icon ? "pl-10" : "pl-3"
				} ${inputClassName}`}
			/>
		</div>
		{children}
	</div>
);

export default AuthField;
