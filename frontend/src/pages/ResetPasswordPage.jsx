import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Loader, KeyRound } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [expired, setExpired] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password.length < 6) {
			return toast.error("Password must be at least 6 characters long");
		}
		if (password !== confirmPassword) {
			return toast.error("Passwords do not match");
		}

		setLoading(true);
		try {
			await axios.post(`/auth/reset-password/${token}`, { password });
			toast.success("Password updated. Please log in.");
			navigate("/login");
		} catch (error) {
			const message = error.response?.data?.message || "Something went wrong. Please try again.";
			toast.error(message);
			if (error.response?.status === 400 && /invalid or has expired/i.test(message)) setExpired(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white min-h-screen'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Choose a new password</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.1 }}
			>
				<div className='bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10'>
					{expired ? (
						<div className='text-center space-y-4'>
							<p className='text-sm text-gray-600'>This reset link is invalid or has expired.</p>
							<Link
								to='/forgot-password'
								className='inline-block rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700'
							>
								Request a new link
							</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div>
								<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
									New password
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
									</div>
									<input
										id='password'
										type='password'
										required
										minLength={6}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='block w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
										placeholder='••••••••'
									/>
								</div>
							</div>

							<div>
								<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
									Confirm new password
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
									</div>
									<input
										id='confirmPassword'
										type='password'
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className='block w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
										placeholder='••••••••'
									/>
								</div>
							</div>

							<button
								type='submit'
								disabled={loading}
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50'
							>
								{loading ? (
									<>
										<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
										Saving...
									</>
								) : (
									<>
										<KeyRound className='mr-2 h-5 w-5' aria-hidden='true' />
										Update password
									</>
								)}
							</button>
						</form>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPasswordPage;
