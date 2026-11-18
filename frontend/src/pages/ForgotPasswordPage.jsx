import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthSubmit from "../components/AuthSubmit";

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
		<AuthLayout
			title='Forgot your password?'
			subtitle="Enter the email you signed up with and we'll send you a link to choose a new one."
			footer={
				<Link to='/login' className='inline-flex items-center font-medium text-brand hover:text-brand-dark'>
					<ArrowLeft className='mr-1 h-4 w-4' /> Back to login
				</Link>
			}
		>
			{sent ? (
				<div className='space-y-3 text-center'>
					<p className='font-semibold text-ink'>Check your inbox</p>
					<p className='text-sm text-muted'>
						If an account exists for <span className='font-medium text-ink'>{email}</span>, a reset link is on
						its way. It expires in 1 hour. Don't forget to check your spam folder.
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} className='space-y-5'>
					<AuthField
						id='email'
						label='Email address'
						icon={Mail}
						type='email'
						autoComplete='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='you@example.com'
					/>
					<AuthSubmit loading={loading} loadingText='Sending...' icon={Send}>
						Send reset link
					</AuthSubmit>
				</form>
			)}
		</AuthLayout>
	);
};

export default ForgotPasswordPage;
