import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import ProductForm from "./ProductForm";

const CreateProductForm = () => {
	const { createProduct, loading } = useProductStore();
	const [formKey, setFormKey] = useState(0); // changing the key clears the form after a successful create

	// start of handleCreate
	const handleCreate = async (productData) => {
		try {
			await createProduct(productData);
			toast.success("Product created successfully");
			setFormKey((key) => key + 1);
		} catch (error) {
			// error toast already shown by the store; keep the form data so nothing is lost
		}
	};
	// end of handleCreate

	return (
		<div className='mx-auto max-w-2xl rounded-2xl border border-line bg-white p-5 sm:p-8'>
			<h2 className='mb-6 font-display text-2xl font-bold text-ink'>Create new product</h2>
			<ProductForm
				key={formKey}
				onSubmit={handleCreate}
				loading={loading}
				icon={PlusCircle}
				submitLabel='Create product'
				loadingLabel='Creating...'
			/>
		</div>
	);
};

export default CreateProductForm;
