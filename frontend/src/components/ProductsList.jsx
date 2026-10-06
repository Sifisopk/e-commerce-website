import { motion } from "framer-motion";
import { Trash, Star, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

	// start of confirm before delete
	const handleDelete = (productId, productName) => {
		if (window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
			deleteProduct(productId);
		}
	};
	// end of confirm before delete

	return (
		<motion.div
			className='bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th
							scope='col'   
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-white divide-y divide-gray-200'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-50'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.images?.[0]}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-gray-900'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-600'>R{product.price.toFixed(2)}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-600'>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-200 text-gray-500"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3'>
								<Link
									to={`/secret-dashboard/edit/${product._id}`}
									className='text-red-600 hover:text-red-700 inline-block'
								>
									<Pencil className='h-5 w-5' />
								</Link>
								<button
									onClick={() => handleDelete(product._id, product.name)}
									className='text-gray-500 hover:text-gray-700'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			</div>
		</motion.div>
	);
};
export default ProductsList;