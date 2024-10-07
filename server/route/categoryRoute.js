const express=require('express');
const router=express.Router();
// importing function from controller
const {CategoryInsert,GetCategory,DeleteCategory,UpdateCategory,GetSingleCategory}=require('../controller/category_controller');

router.post('/categoryInsert',CategoryInsert);
router.get('/GetCategory',GetCategory);
router.get('/getSingleCategory/:id',GetSingleCategory);

router.delete('/deleteCategory/:id',DeleteCategory);
router.put('/UpdateCategory/:id',UpdateCategory);





module.exports=router;