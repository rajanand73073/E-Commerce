import { Router } from "express";
import { verifyJWTAdmin, verifyJWTUser } from "../middleware/auth.middleware";
import { getOrderHistory, placeOrder, updateOrderStatus } from "../controllers/orderController/Order.controller";





const router = Router()


router.route('/placeOrder').post(verifyJWTUser,placeOrder)
router.route('/OrderHistory').get(verifyJWTUser,getOrderHistory)
router.route('/updatestatus').put(verifyJWTAdmin,updateOrderStatus)




export default router