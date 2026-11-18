import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthSubmit from "../components/AuthSubmit";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login({ email, password });
	};

	return (
		<AuthLayout
			title='Log into your account'
			footer={
				<>
					Not a member?{" "}
					<Link to='/signup' className='font-medium text-brand hover:text-brand-dark'>
						Sign up now →
					</Link>
				</>
			}
		>
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

				<AuthField
					id='password'
					label='Password'
					icon={Lock}
					type='password'
					autoComplete='current-password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='••••••••'
				>
					<div className='mt-2 text-right'>
						<Link to='/forgot-password' className='text-sm text-brand hover:text-brand-dark'>
							Forgot password?
						</Link>
					</div>
				</AuthField>

				<AuthSubmit loading={loading} icon={LogIn}>
					Login
				</AuthSubmit>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;
