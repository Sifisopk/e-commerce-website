import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";

const categories = ["sweatpants", "t-shirts", "hoodies", "glasses", "bags", "beanies"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		images: [],
		colors: "",
		sizes: "",
	});

  const { createProduct, loading } = useProductStore();

  // start of handleSubmit
  const handleSubmit = async (e) => {
		e.preventDefault();
   try {
    await createProduct({
        ...newProduct,
        colors: newProduct.colors.split(",").map((c) => c.trim()).filter(Boolean),
        sizes: newProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.success("Product created successfully");
    setNewProduct({ name: "", description: "", price: "", category: "", images: [], colors: "", sizes: "" });
   } catch (error) {
    // error toast already shown by the store; keep the form data so nothing is lost
   }
  }
  // end of handleSubmit

  const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
			};
			reader.readAsDataURL(file);
		});
	};

  const removeImage = (index) => {
		setNewProduct((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

  
  return (
    <motion.div
			className='bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
      <h2 className='text-2xl font-semibold mb-6 text-gray-900'>Create New Product</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        		<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2
						 px-3 text-gray-900 focus:outline-none focus:ring-2
						focus:ring-red-500 focus:border-red-500'
						required
					/>
				</div>

<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-700'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm
						 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 
						 focus:border-red-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-700'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm 
						py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500
						 focus:border-red-500'
						required
					/>
				</div>

        <div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-700'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md
						 shadow-sm py-2 px-3 text-gray-900 focus:outline-none 
						 focus:ring-2 focus:ring-red-500 focus:border-red-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

        <div>
					<label htmlFor='colors' className='block text-sm font-medium text-gray-700'>
						Colors (comma separated)
					</label>
					<input
						type='text'
						id='colors'
						value={newProduct.colors}
						onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
						placeholder='e.g. Blue, Black, White'
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2
						 px-3 text-gray-900 focus:outline-none focus:ring-2
						focus:ring-red-500 focus:border-red-500'
					/>
				</div>

        <div>
					<label htmlFor='sizes' className='block text-sm font-medium text-gray-700'>
						Sizes (comma separated)
					</label>
					<input
						type='text'
						id='sizes'
						value={newProduct.sizes}
						onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
						placeholder='e.g. S, M, L, XL or 30, 32, 34'
						className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2
						 px-3 text-gray-900 focus:outline-none focus:ring-2
						focus:ring-red-500 focus:border-red-500'
					/>
				</div>

        <div className='mt-1'>
                  <input type='file' id='image' className='sr-only' accept='image/*' multiple onChange={handleImageChange}/>
                  <label
                    htmlFor='image'
                    className='cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    <Upload className='h-5 w-5 inline-block mr-2' />
                    Upload Images
                  </label>

                  {newProduct.images.length > 0 && (
                    <div className='mt-3 flex flex-wrap gap-3'>
                        {newProduct.images.map((img, index) => (
                            <div key={index} className='relative'>
                                <img src={img} alt={`preview ${index}`} className='h-20 w-20 object-cover rounded-md border border-gray-200' />
                                <button
                                    type='button'
                                    onClick={() => removeImage(index)}
                                    className='absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1'
                                >
                                    <X className='h-3 w-3 text-white' />
                                </button>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
{/*create product submit button*/}
                <button
					type='submit' 
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-400 hover:bg-red-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
					disabled={loading || newProduct.images.length === 0}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>

      </form>

    

    </motion.div>
  )
}

export default CreateProductForm