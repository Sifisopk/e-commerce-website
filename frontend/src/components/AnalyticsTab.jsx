import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, Banknote } from "lucide-react";
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
			<div className='mx-auto max-w-6xl animate-pulse'>
				<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{[...Array(4)].map((_, i) => (
						<div key={i} className='h-28 rounded-xl border border-line bg-surface' />
					))}
				</div>
				<div className='h-80 rounded-xl border border-line bg-surface' />
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-6xl'>
			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<AnalyticsCard title='Total users' value={analyticsData.users.toLocaleString()} icon={Users} />
				<AnalyticsCard title='Total products' value={analyticsData.products.toLocaleString()} icon={Package} />
				<AnalyticsCard title='Total sales' value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
				<AnalyticsCard
					title='Total revenue'
					value={`R${analyticsData.totalRevenue.toLocaleString()}`}
					icon={Banknote}
				/>
			</div>

			<div className='rounded-xl border border-line bg-white p-4 sm:p-6'>
				<h2 className='mb-4 font-display text-xl font-bold text-ink'>Last 7 days</h2>
				<ResponsiveContainer width='100%' height={320}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#E7E5E2' />
						<XAxis dataKey='date' stroke='#5E5E5E' tick={{ fontSize: 12 }} interval='preserveStartEnd' />
						<YAxis yAxisId='left' stroke='#5E5E5E' tick={{ fontSize: 12 }} allowDecimals={false} />
						<YAxis yAxisId='right' orientation='right' stroke='#5E5E5E' tick={{ fontSize: 12 }} />
						<Tooltip formatter={(value, name) => (name === "Revenue" ? `R${value}` : value)} />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#D4121A'
							strokeWidth={2}
							activeDot={{ r: 6 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#111111'
							strokeWidth={2}
							activeDot={{ r: 6 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon }) => (
	<div className='relative overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6'>
		<div className='relative z-10'>
			<p className='mb-1 text-sm font-semibold text-muted'>{title}</p>
			<h3 className='font-display text-3xl font-bold text-ink'>{value}</h3>
		</div>
		<div className='absolute -bottom-4 -right-4 text-brand/10'>
			<Icon className='h-28 w-28' />
		</div>
	</div>
);
