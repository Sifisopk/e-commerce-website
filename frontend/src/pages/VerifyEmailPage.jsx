import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "../lib/axios";
import LoadingSpinner from "../components/LoadingSpinner";

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

	if (status === "loading") return <LoadingSpinner />;

	const ok = status === "success";

	return (
		<div className='flex min-h-[70vh] items-center justify-center px-4 py-10'>
			<div className='w-full max-w-md rounded-2xl border border-line bg-white p-6 text-center shadow-sm sm:p-8'>
				{ok ? (
					<CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-600' />
				) : (
					<XCircle className='mx-auto mb-4 h-16 w-16 text-brand' />
				)}
				<h1 className='mb-2 font-display text-2xl font-bold text-ink'>{ok ? "Email verified" : "Couldn't verify"}</h1>
				<p className='mb-6 text-muted'>{message}</p>
				{!ok && (
					<p className='mb-6 text-sm text-muted'>
						If you're logged in, you can ask for a new link from your cart page.
					</p>
				)}
				<Link
					to={ok ? "/cart" : "/"}
					className='inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark'
				>
					{ok ? "Continue to cart" : "Back to shop"}
				</Link>
			</div>
		</div>
	);
};

export default VerifyEmailPage;
