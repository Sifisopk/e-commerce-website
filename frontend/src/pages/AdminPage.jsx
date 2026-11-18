import { BarChart, PlusCircle, ShoppingBasket, ClipboardList, Settings, Tags } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import CategoriesTab from "../components/CategoriesTab";
import OrdersList from "../components/OrdersList";
import SettingsTab from "../components/SettingsTab";

import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "categories", label: "Categories", icon: Tags },
	{ id: "orders", label: "Orders", icon: ClipboardList },
	{ id: "analytics", label: "Analytics", icon: BarChart },
	{ id: "settings", label: "Settings", icon: Settings },
];

const AdminPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || "create";
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-[70vh] bg-white'>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
				<h1 className='mb-6 font-display text-3xl font-bold tracking-tight sm:text-4xl'>Admin dashboard</h1>

				{/* start of tabs (scroll sideways on small phones) */}
				<div className='-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
					<div className='flex w-max gap-2'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setSearchParams({ tab: tab.id })}
								aria-current={activeTab === tab.id ? "page" : undefined}
								className={`flex items-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
									activeTab === tab.id ? "bg-ink text-white" : "bg-surface text-ink hover:bg-line"
								}`}
							>
								<tab.icon className='mr-2 h-5 w-5' />
								{tab.label}
							</button>
						))}
					</div>
				</div>
				{/* end of tabs */}

				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "categories" && <CategoriesTab />}
				{activeTab === "orders" && <OrdersList />}
				{activeTab === "analytics" && <AnalyticsTab />}
				{activeTab === "settings" && <SettingsTab />}
			</div>
		</div>
	);
};
export default AdminPage;
