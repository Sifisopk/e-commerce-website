import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthSubmit from "../components/AuthSubmit";

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
		<AuthLayout title='Choose a new password'>
			{expired ? (
				<div className='space-y-4 text-center'>
					<p className='text-sm text-muted'>This reset link is invalid or has expired.</p>
					<Link
						to='/forgot-password'
						className='inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'
					>
						Request a new link
					</Link>
				</div>
			) : (
				<form onSubmit={handleSubmit} className='space-y-5'>
					<AuthField
						id='password'
						label='New password'
						icon={Lock}
						type='password'
						autoComplete='new-password'
						minLength={6}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='••••••••'
					/>
					<AuthField
						id='confirmPassword'
						label='Confirm new password'
						icon={Lock}
						type='password'
						autoComplete='new-password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder='••••••••'
					/>
					<AuthSubmit loading={loading} loadingText='Saving...' icon={KeyRound}>
						Update password
					</AuthSubmit>
				</form>
			)}
		</AuthLayout>
	);
};

export default ResetPasswordPage;
