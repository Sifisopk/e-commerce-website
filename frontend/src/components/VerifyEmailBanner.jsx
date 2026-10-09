import { useState } from "react";
import { MailWarning } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";

// Shows only for new accounts that haven't clicked the email link yet.
const VerifyEmailBanner = () => {
	const { user } = useUserStore();
	const [sending, setSending] = useState(false);

	if (user?.emailVerified !== false) return null;

	const handleResend = async () => {
		setSending(true);
		try {
			const res = await axios.post("/auth/resend-verification");
			toast.success(res.data.message, { id: "verify" });
		} catch (error) {
			toast.error(error.response?.data?.message || "Couldn't send the email", { id: "verify" });
		} finally {
			setSending(false);
		}
	};

	return (
		<div className='mb-6 flex flex-col gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-start gap-3'>
				<MailWarning className='mt-0.5 h-5 w-5 shrink-0 text-yellow-600' />
				<p className='text-sm text-yellow-800'>
					Please verify <span className='font-medium'>{user.email}</span> so your order confirmation reaches you. Check
					your inbox (and spam) for our email.
				</p>
			</div>
			<button
				type='button'
				onClick={handleResend}
				disabled={sending}
				className='shrink-0 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50'
			>
				{sending ? "Sending..." : "Resend email"}
			</button>
		</div>
	);
};

export default VerifyEmailBanner;
