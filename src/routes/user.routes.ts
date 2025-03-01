import {Router}  from "express"
import { loginUser, registerUser } from "../controllers/UserController/User.controller"
import { verifyJWTUser } from "../middleware/auth.middleware"
import { getAllProducts, getProductById } from "../controllers/UserController/Product.controller"
import { getOrderHistory, placeOrder } from "../controllers/orderController/Order.controller"

const router = Router()

router.route('/userRegister').post(registerUser)
router.route('/userLogin').post(loginUser)
router.route('/getAllProducts').post(verifyJWTUser,getAllProducts)
router.route('/getProductById').get(verifyJWTUser,getProductById)






export default router