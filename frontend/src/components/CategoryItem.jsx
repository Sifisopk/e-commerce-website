import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    return (
        <Link
            to={"/category" + category.href}
            className='group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface'
        >
            <img
                src={category.imageUrl}
                alt={category.name}
                className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                loading='lazy'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
                <h3 className='font-display text-xl font-bold text-white sm:text-2xl'>{category.name}</h3>
                <p className='mt-0.5 text-sm text-white/85'>Shop now →</p>
            </div>
        </Link>
    );
};

export default CategoryItem;
