const express=require('express');
const router=express.Router();
const middleware = require('../middleware/authenticateToken')

//importing function from controller
const {bucketListInsert,GetBucketlist,updateBucketlist,deleteBucketlist} = require('../controller/bucketlist_controller');



router.post('/bucketListInsert',middleware,bucketListInsert);
router.get('/getbucketlist',middleware,GetBucketlist);
router.delete('/deletebucketlist/:id',deleteBucketlist);
router.put('/updatebucketlist/:id',updateBucketlist);






module.exports=router;


