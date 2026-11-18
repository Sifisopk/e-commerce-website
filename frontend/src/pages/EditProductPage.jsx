import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import ProductForm from "../components/ProductForm";

const EditProductPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { currentProduct, fetchProductById, updateProduct, loading } = useProductStore();
	const [fetchedId, setFetchedId] = useState(null);

	// start of load product
	useEffect(() => {
		let cancelled = false;
		fetchProductById(id).then(() => {
			if (!cancelled) setFetchedId(id);
		});
		return () => {
			cancelled = true;
		};
	}, [fetchProductById, id]);
	// end of load product

	const handleUpdate = async (productData) => {
		try {
			await updateProduct(id, productData);
			toast.success("Product updated");
			navigate("/secret-dashboard?tab=products");
		} catch (error) {
			// error toast already shown by the store
		}
	};

	const backLink = (
		<Link
			to='/secret-dashboard?tab=products'
			className='mb-6 inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-brand'
		>
			<ArrowLeft size={16} className='mr-1.5' />
			Back to products
		</Link>
	);

	if (fetchedId !== id) {
		return (
			<div className='min-h-[70vh] px-4 py-10'>
				<div className='mx-auto max-w-2xl animate-pulse space-y-4 rounded-2xl border border-line bg-white p-8'>
					<div className='h-8 w-48 rounded bg-line' />
					<div className='h-11 rounded-lg bg-line' />
					<div className='h-28 rounded-lg bg-line' />
					<div className='h-11 rounded-lg bg-line' />
				</div>
			</div>
		);
	}

	if (!currentProduct || currentProduct._id !== id) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-10 text-center'>
				<p className='mb-4 text-lg font-semibold text-ink'>Product not found</p>
				{backLink}
			</div>
		);
	}

	return (
		<div className='min-h-[70vh] px-4 py-8 sm:py-10'>
			<div className='mx-auto max-w-2xl'>
				{backLink}
				<div className='rounded-2xl border border-line bg-white p-5 sm:p-8'>
					<h1 className='mb-6 font-display text-2xl font-bold text-ink'>Edit product</h1>
					<ProductForm
						key={currentProduct._id}
						initialValues={{
							name: currentProduct.name,
							description: currentProduct.description,
							price: currentProduct.price,
							category: currentProduct.category,
							colors: (currentProduct.colors || []).join(", "),
							sizes: (currentProduct.sizes || []).join(", "),
							images: currentProduct.images || [],
						}}
						onSubmit={handleUpdate}
						loading={loading}
						icon={Save}
						submitLabel='Save changes'
						loadingLabel='Saving...'
					/>
				</div>
			</div>
		</div>
	);
};

export default EditProductPage;
