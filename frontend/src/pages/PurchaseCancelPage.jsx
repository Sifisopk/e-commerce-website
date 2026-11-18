import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ContactSupport from "../components/ContactSupport";

const PurchaseCancelPage = () => {
    return (
        <div className='flex min-h-[70vh] items-center justify-center px-4 py-10'>
            <div className='w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lg sm:p-8'>
                <XCircle className='mx-auto mb-4 h-16 w-16 text-brand' />
                <h1 className='mb-2 text-center font-display text-3xl font-bold tracking-tight text-ink'>
                    Purchase cancelled
                </h1>
                <p className='mb-6 text-center text-muted'>
                    Your order has been cancelled. No charges have been made.
                </p>

                <ContactSupport
                    className='mb-6'
                    message='Ran into a problem during checkout? Get in touch and we will help.'
                />

                <div className='space-y-3'>
                    <Link
                        to='/cart'
                        className='flex h-12 w-full items-center justify-center rounded-lg bg-brand font-semibold text-white transition-colors hover:bg-brand-dark'
                    >
                        Back to cart
                    </Link>
                    <Link
                        to='/'
                        className='flex h-12 w-full items-center justify-center rounded-lg border border-ink font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
                    >
                        Return to shop
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCancelPage;
