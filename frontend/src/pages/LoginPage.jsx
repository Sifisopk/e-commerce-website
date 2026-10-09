import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";



const LoginPage = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");


	const {login, loading} = useUserStore();

  const handleSubmit =(e) =>{
    e.preventDefault();
	login({email, password});
  }

  

  return (
   <div className="flex min-h-screen flex-col justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
        
        <motion.div
                className="mx-auto w-full max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8}}>

                    
                <h2 className="mt-2 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">Log into your account</h2>
        </motion.div>

        <motion.div
                className="mx-auto mt-6 w-full max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8}}>

                <div className="bg-white px-4 py-6 shadow-sm border border-gray-200 rounded-lg sm:px-10 sm:py-8">

                <form onSubmit={handleSubmit} className="space-y-6">


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
									className=' block w-full px-3 py-2 pl-10 bg-white border border-gray-300 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-red-500 
									 focus:border-red-500 sm:text-sm'
									placeholder='you@example.com'
								/>
							</div>
						</div>

                        <div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className=' block w-full px-3 py-2 pl-10 bg-white border border-gray-300 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
							<div className='text-right'>
        							 <Link to='/forgot-password' className='text-sm text-red-600 hover:text-red-700'>Forgot password?</Link>
    							</div>
						</div>


                        <button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-red-600
							 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
                </form>
                    <p className='mt-8 text-center text-sm text-gray-600'> Not a member?{" "}
                     <Link to='/signup' className='font-medium text-red-600 hover:text-red-700'>
                       Sign up now <ArrowRight className='inline h-4 w-4' />
                        </Link>
                      </p>
                </div>    
            
        </motion.div>
        </div>
  )
}

export default LoginPage