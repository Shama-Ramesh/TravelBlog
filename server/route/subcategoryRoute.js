const express=require('express');
const router=express.Router();
// importing function from controller
const {SubcategoryInsert,GetSubcategory,DeleteSubcategory,UpdateSubcategory,GetSingleSubcategory}=require('../controller/subcategory_controller');

router.post('/subcategoryInsert',SubcategoryInsert);
router.get('/GetSubcategory',GetSubcategory);
router.get('/getSinglesubcategory/:id',GetSingleSubcategory);

router.delete('/deleteSubcategory/:id',DeleteSubcategory);
router.put('/UpdateSubcategory/:id',UpdateSubcategory);





module.exports=router;