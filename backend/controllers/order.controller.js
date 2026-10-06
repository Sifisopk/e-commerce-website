import Order from "../models/order.model.js";

const VALID_STATUSES = ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

// start of getAllOrders (admin)
export const getAllOrders = async (req,res) => {
    try{
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name images")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error){
        console.log("Error getting all orders", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of getAllOrders (admin)

// start of updateOrderStatus (admin)
export const updateOrderStatus = async (req,res) => {
    try{
        const { status } = req.body;

        if(!VALID_STATUSES.includes(status)){
            return res.status(400).json({message: "Invalid status"});
        }

        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }

        order.status = status;
        order.statusHistory.push({ status });
        await order.save();

        res.json(order);
    }
    catch (error){
        console.log("Error updating order status", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of updateOrderStatus (admin)

// start of getMyOrders (customer)
export const getMyOrders = async (req,res) => {
    try{
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name images")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error){
        console.log("Error getting user orders", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of getMyOrders (customer)

// start of trackOrder (public, by order number + email)
export const trackOrder = async (req,res) => {
    try{
        const { orderNumber, email } = req.body;

        const cleanOrderNumber = String(orderNumber || "").trim().replace(/^#/, "").toUpperCase();
        const cleanEmail = String(email || "").trim().toLowerCase();

        if(!cleanOrderNumber || !cleanEmail){
            return res.status(400).json({message: "Please enter your order number and email"});
        }

        const order = await Order.findOne({ orderNumber: cleanOrderNumber }).populate("user", "email");

        if(!order || order.user?.email?.toLowerCase() !== cleanEmail){
            // same message either way, so a guess can't tell which part was wrong
            return res.status(404).json({message: "We couldn't find an order matching those details"});
        }

        res.json({
            orderNumber: order.orderNumber,
            status: order.status,
            statusHistory: order.statusHistory,
            products: order.products,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
        });
    }
    catch (error){
        console.log("Error tracking order", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
// end of trackOrder (public, by order number + email)