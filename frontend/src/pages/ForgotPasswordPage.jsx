import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Loader, ArrowLeft, Send } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post("/auth/forgot-password", { email });
			setSent(true);
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
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
				<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Forgot your password?</h2>
				<p className='mt-2 text-center text-sm text-gray-500 px-4'>
					Enter the email you signed up with and we'll send you a link to choose a new one.
				</p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.1 }}
			>
				<div className='bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10'>
					{sent ? (
						<div className='text-center space-y-3'>
							<p className='text-gray-900 font-medium'>Check your inbox</p>
							<p className='text-sm text-gray-600'>
								If an account exists for <span className='font-medium'>{email}</span>, a reset link is on its
								way. It expires in 1 hour. Don't forget to check your spam folder.
							</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
									Email address
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
									</div>
									<input
										id='email'
										type='email'
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='block w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
										placeholder='you@example.com'
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
										Sending...
									</>
								) : (
									<>
										<Send className='mr-2 h-5 w-5' aria-hidden='true' />
										Send reset link
									</>
								)}
							</button>
						</form>
					)}

					<p className='mt-8 text-center text-sm text-gray-600'>
						<Link to='/login' className='font-medium text-red-600 hover:text-red-700 inline-flex items-center'>
							<ArrowLeft className='mr-1 h-4 w-4' /> Back to login
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPasswordPage;
