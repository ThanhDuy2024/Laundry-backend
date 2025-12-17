import { Order } from "../models/order.model.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.users.id;

        req.body.userId = userId;

        await Order.create(req.body);
        res.json({
            code: "success",
            message: "Tao order thanh cong"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Loi tao order"
        })
    }
}