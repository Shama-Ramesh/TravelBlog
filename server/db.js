const mongoose=require('mongoose')

const URI="mongodb://localhost:27017/travel"

const dbConnection=async()=>{
    try{
        await mongoose.connect(URI)
        console.log("Database Connection Successfull")
    }catch(err){
        console.log(err)
    }
}

module.exports=dbConnection;