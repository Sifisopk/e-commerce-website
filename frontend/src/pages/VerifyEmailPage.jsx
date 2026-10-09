import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "../lib/axios";

const VerifyEmailPage = () => {
	const { token } = useParams();
	const [status, setStatus] = useState("loading"); // loading | success | error
	const [message, setMessage] = useState("");
	const hasRun = useRef(false);

	useEffect(() => {
		// once-only guard: the link works one time, and dev mode runs effects twice
		if (hasRun.current) return;
		hasRun.current = true;

		const verify = async () => {
			try {
				const res = await axios.post(`/auth/verify-email/${token}`);
				setMessage(res.data.message);
				setStatus("success");
			} catch (error) {
				setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
				setStatus("error");
			}
		};

		verify();
	}, [token]);

	if (status === "loading") {
		return (
			<div className='min-h-screen flex items-center justify-center bg-white'>
				<div className='relative'>
					<div className='w-16 h-16 border-red-200 border-2 rounded-full' />
					<div className='w-16 h-16 border-red-600 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				</div>
			</div>
		);
	}

	const ok = status === "success";

	return (
		<div className='min-h-screen flex items-center justify-center px-4 bg-white'>
			<div className='max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg p-6 sm:p-8 text-center'>
				{ok ? (
					<CheckCircle className='text-red-600 w-16 h-16 mb-4 mx-auto' />
				) : (
					<XCircle className='text-red-600 w-16 h-16 mb-4 mx-auto' />
				)}
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>{ok ? "Email verified" : "Couldn't verify"}</h1>
				<p className='text-gray-600 mb-6'>{message}</p>
				{!ok && (
					<p className='text-sm text-gray-500 mb-6'>
						If you're logged in, you can ask for a new link from your cart page.
					</p>
				)}
				<Link
					to={ok ? "/cart" : "/"}
					className='inline-block rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700'
				>
					{ok ? "Continue to cart" : "Back to shop"}
				</Link>
			</div>
		</div>
	);
};

export default VerifyEmailPage;
