const AdminSchema =require('../model/admin_login')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const key="Hello"



const AdminLogin=async(req,res)=>{
    try{
        
        const {email,password}=req.body;
        const user=await AdminSchema.findOne({email})
         if(!user){
            return res.json({success:false,message:'Incorrect email or password'})
         }
         const ismatch=await bcrypt.compare(password,user.password)
         if(!ismatch){
            return res.json('Incorrect Password')
         }
         const data=user.id
         const token=await jwt.sign(data,key)
         const success=true;
         res.json({token,success})
    }
    catch(err){
        console.log(err)
    }
}





module.exports={AdminLogin}