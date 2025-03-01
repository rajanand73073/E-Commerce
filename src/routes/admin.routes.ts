import {Router}  from "express"
import {registerAdmin,adminLogin} from "../controllers/AdminController/Admin.controller"
import { verifyJWTAdmin} from "../middleware/auth.middleware"
import { deleteCategory, listCategories, manageCategory, updateCategory } from "../controllers/AdminController/Category.controller"
import { salesCategoryWise, topSellingProducts, worstSellingProducts } from "../controllers/AdminController/SalesReport.controller"


const router = Router()

router.route('/adminRegister').post(registerAdmin)
router.route('/adminLogin').post(adminLogin)
router.route('/manageCategory').post(verifyJWTAdmin,manageCategory)
router.route('/updateCategory').patch(verifyJWTAdmin,updateCategory)
router.route('/deleteCategory').patch(verifyJWTAdmin,deleteCategory)
router.route('/listCategories').get(verifyJWTAdmin,listCategories)
router.route('/salesCategoryWise').get(verifyJWTAdmin,salesCategoryWise)
router.route('topSellingProducts').get(verifyJWTAdmin,topSellingProducts)
router.route('worstSellingProducts').get(verifyJWTAdmin,worstSellingProducts)






export default router