const FeedbackSchema=require('../model/feedback_model')



const FeedbackInsert=async(req,res)=>{
    try{
        console.log(req.body,'insert')
        const {name,email,message}=req.body;


        const FeedbackInfo=new FeedbackSchema({name,email,message,user_id:req.user});
        const FeedbackInfoSaved=await FeedbackInfo.save();
        res.send(FeedbackInfoSaved);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal some error occured");
    }
}


const GetAllFeedbackDetails = async (req, res) => {
    try {
        const FeedbackInfo= await FeedbackSchema.find().populate('user_id')
        console.log(FeedbackInfo)
        res.send(FeedbackInfo);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
}

module.exports={FeedbackInsert,GetAllFeedbackDetails}