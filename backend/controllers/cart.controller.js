import Product from "../models/product.model.js";

//get cart products
export const getCartProducts = async (req,res) => {
    try{
        const products = await Product.find({_id: {$in: req.user.cartItems.map(item => item.product)}});
        
        //add quantity to each product
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
            return {...product.toJSON(), quantity: item.quantity};    
        });

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
        const {productId, quantity} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push({product: productId, quantity: 1});
        }

        await user.save();
        res.json(user.cartItems);
    }
    catch (error){
        console.log("Error adding to cart", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//remove all from cart
export const removeAllFromCart = async (req,res) => {
    try{
    const {productId} = req.body;
    const user = req.user;
    if(!productId){
        user.cartItems = [];
    }
    else{
        user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);

    }
    await user.save();
    res.json(user.cartItems);
}
    catch (error){
        console.log("Error removing all from cart", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

//update quantity of a product in cart
export const updateQuatity = async (req,res) => {
    try{
        const {productId, quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        }else{
            return res.status(404).json({message: "Product not found"});    
        }
    }
    catch (error){
        console.log("Error updating quantity", error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}