import Product from "../models/product.model.js";

//get cart products
export const getCartProducts = async (req,res) => {
    try{
        const productIds = req.user.cartItems.map(item => item.product);
        const products = await Product.find({_id: {$in: productIds}});
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        // start of build one line per cart item, not per product
        const cartItems = req.user.cartItems
            .map(item => {
                const product = productMap.get(item.product.toString());
                if(!product) return null;
                return {
                    ...product.toJSON(),
                    quantity: item.quantity,
                    color: item.color || "",
                    size: item.size || "",
                    cartItemId: item._id,
                };
            })
            .filter(Boolean);
        // end of build one line per cart item, not per product

        res.json(cartItems);
    }
    catch (error){
        console.log("Error getting cart products", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

//add to cart
export const addToCart = async (req,res) => {
    try{
        const {productId, quantity, color, size} = req.body;
        const user = req.user;

        // start of match on product + color + size
        const existingItem = user.cartItems.find(item =>
            item.product.toString() === productId &&
            (item.color || "") === (color || "") &&
            (item.size || "") === (size || "")
        );

        if(existingItem){
            existingItem.quantity += quantity || 1;
        }else{
            user.cartItems.push({
                product: productId,
                quantity: quantity || 1,
                color: color || "",
                size: size || "",
            });
        }
        // end of match on product + color + size

        await user.save();
        res.json(user.cartItems);
    }
    catch (error){
        console.log("Error adding to cart", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//remove one cart line, or clear all if no cartItemId given
export const removeAllFromCart = async (req,res) => {
    try{
    const {cartItemId} = req.body;
    const user = req.user;
    if(!cartItemId){
        user.cartItems = [];
    }
    else{
        user.cartItems = user.cartItems.filter(item => item._id.toString() !== cartItemId);
    }
    await user.save();
    res.json(user.cartItems);
}
    catch (error){
        console.log("Error removing from cart", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//update quantity of a specific cart line
export const updateQuatity = async (req,res) => {
    try{
        const {cartItemId, quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item._id.toString() === cartItemId);
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item._id.toString() !== cartItemId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        }else{
            return res.status(404).json({message: "Cart item not found"});    
        }
    }
    catch (error){
        console.log("Error updating quantity", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}