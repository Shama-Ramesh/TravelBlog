const express=require('express');
const router=express.Router();
// importing function from controller
const {UserInsert,GetUser,DeleteUser,UpdateUser,GetSingleUser,UserRegister,UserLogin, GetProfile, updateUserStatus, updateUserProfile}=require('../controller/user_controller');
const fetchAdmin = require('../middleware/authenticateToken');
const { AdminLogin } = require('../controller/admin_controller');


router.post('/userInsert',UserInsert);
router.get('/GetUser',GetUser);
router.get('/getSingleUser/:id',GetSingleUser);
router.get('/getProfile',fetchAdmin,GetProfile);

router.delete('/deleteUser/:id',DeleteUser);
router.put('/UpdateUser',fetchAdmin,updateUserProfile);
router.put('/update-status/:id',updateUserStatus);
router.post('/userRegister',UserRegister);
router.post('/userLogin',UserLogin);


router.post('/adminLogin',AdminLogin)







module.exports=router;