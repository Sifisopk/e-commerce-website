import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{[...Array(4)].map((_, i) => (
						<div key={i} className='h-28 bg-gray-100 rounded-lg border border-gray-200' />
					))}
				</div>
				<div className='h-96 bg-gray-100 rounded-lg border border-gray-200' />
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`R${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
				/>	
			</div>
			<motion.div
				className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' horizontal={true} vertical={true} stroke="#E5E7EB" />
						<XAxis dataKey='date' stroke='#6B7280' />
						<YAxis yAxisId='left' stroke='#6B7280' />
						<YAxis yAxisId='right' orientation='right' stroke='#6B7280' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#DC2626'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#1F2937'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon }) => (
	<motion.div
		className='bg-white rounded-lg p-6 shadow-sm border border-gray-200 overflow-hidden relative'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-gray-500 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-gray-900 text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute -bottom-4 -right-4 text-red-100'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);