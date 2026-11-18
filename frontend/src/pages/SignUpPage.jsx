import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthSubmit from "../components/AuthSubmit";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore();

	const setField = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<AuthLayout
			title='Create your account'
			footer={
				<>
					Already have an account?{" "}
					<Link to='/login' className='font-medium text-brand hover:text-brand-dark'>
						Login here →
					</Link>
				</>
			}
		>
			<form onSubmit={handleSubmit} className='space-y-5'>
				<AuthField
					id='name'
					label='Full name'
					icon={User}
					autoComplete='name'
					value={formData.name}
					onChange={setField("name")}
					placeholder='John Doe'
				/>
				<AuthField
					id='email'
					label='Email address'
					icon={Mail}
					type='email'
					autoComplete='email'
					value={formData.email}
					onChange={setField("email")}
					placeholder='you@example.com'
				/>
				<AuthField
					id='password'
					label='Password'
					icon={Lock}
					type='password'
					autoComplete='new-password'
					minLength={6}
					value={formData.password}
					onChange={setField("password")}
					placeholder='••••••••'
				/>
				<AuthField
					id='confirmPassword'
					label='Confirm password'
					icon={Lock}
					type='password'
					autoComplete='new-password'
					value={formData.confirmPassword}
					onChange={setField("confirmPassword")}
					placeholder='••••••••'
				/>

				<AuthSubmit loading={loading} icon={UserPlus}>
					Sign up
				</AuthSubmit>
			</form>
		</AuthLayout>
	);
};

export default SignUpPage;
