import { randomInt } from "crypto";
import Order from "../models/order.model.js";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I so it's easy to read out and type
const PREFIX = "SFB"; // change to your friend's brand initials

// start of generateOrderNumber
export const generateOrderNumber = async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += ALPHABET[randomInt(ALPHABET.length)];
        }
        const orderNumber = `${PREFIX}-${code}`;

        const exists = await Order.exists({ orderNumber });
        if (!exists) return orderNumber;
    }
    throw new Error("Could not generate a unique order number");
};
// end of generateOrderNumber