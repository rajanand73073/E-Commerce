import {Router}  from "express"
import { registerUser } from "../controllers/UserController/User.controller"

const router = Router()

router.route('/register').post(registerUser)



export default router