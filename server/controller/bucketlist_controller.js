const bucketlistSchema = require('../model/bucketlist_model');

// Insert data
const bucketListInsert = async (req, res) => {
    try {
        console.log(req.body);
        const { title, location, description, famousPlace, totalBudget } = req.body;
        const bucketlistInfo = new bucketlistSchema({
            title,
            location,
            description,
            famousPlace,
            totalBudget,
            user:req.user
        });
        const bucketlistSaved = await bucketlistInfo.save();
        res.send(bucketlistSaved);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occurred");
    }
};

// Fetch all data
const GetBucketlist = async (req, res) => {
    try {
        console.log(req.user, 'useridd');
        const bucketlist = await bucketlistSchema.find({ user: req.user });
        res.send(bucketlist);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occurred");
    }
};

// Fetch single data
const GetSingleBucketlist = async (req, res) => {
    try {
        const bucketlist = await bucketlistSchema.findById(req.params.id);
        res.send(bucketlist);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occurred");
    }
};

// Delete data
const deleteBucketlist = async (req, res) => {
    try {
        let bucketlist = await bucketlistSchema.findById(req.params.id);
        if (!bucketlist) {
            return res.status(404).send("Not Found");
        }
        bucketlist = await bucketlistSchema.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Deleted successfully", bucketlist });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occurred");
    }
};

// Update data
const updateBucketlist = async (req, res) => {
    const { title, location, description, famousPlace, totalBudget } = req.body;
    try {
        const newBucketlist = {};
        if (title) newBucketlist.title = title;
        if (location) newBucketlist.location = location;
        if (description) newBucketlist.description = description;
        if (famousPlace) newBucketlist.famousPlace = famousPlace;
        if (totalBudget) newBucketlist.totalBudget = totalBudget;

        console.log(newBucketlist);

        let bucketlist = await bucketlistSchema.findById(req.params.id);
        if (!bucketlist) {
            return res.status(404).send("Not Found");
        }
        bucketlist = await bucketlistSchema.findByIdAndUpdate(req.params.id, { $set: newBucketlist }, { new: true });
        res.json({ bucketlist });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal some error occurred");
    }
};

module.exports = {
    bucketListInsert,
    GetBucketlist,
    GetSingleBucketlist,
    deleteBucketlist,
    updateBucketlist
};
