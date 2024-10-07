const subcategorySchema = require('../model/subcategory_model');

// Insert the data
const SubcategoryInsert = async (req, res) => {
  try {
    const {subcategory } = req.body;
    const category=req.body.category;
    const SubsubcategoryInfo = new subcategorySchema({ subcategory,category });
    const subcategorySaved = await SubsubcategoryInfo.save();
    res.send(subcategorySaved);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch the data
const GetSubcategory = async (req, res) => {
  try {
    console.log("object")

    const subcategory = await subcategorySchema.find().populate('category');
    res.send(subcategory);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch a single subcategory by ID
const GetSingleSubcategory = async (req, res) => {
  try {
    const subcategory = await subcategorySchema.findById(req.params.id);
    res.send(subcategory);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Delete the data
const DeleteSubcategory = async (req, res) => {
  try {
    const subcategory = await subcategorySchema.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).send("subcategory not found");
    }
    res.json({ success: true, message: "subcategory deleted successfully", subcategory });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
};

// Update the data
const UpdateSubcategory = async (req, res) => {
  const { subcategory,category } = req.body;
  try {
    const newSubcategory = {};
   
    if (subcategory) newSubcategory.subcategory = subcategory;
    if (category) newSubcategory.category = category;
    

    let subcategoryData = await subcategorySchema.findById(req.params.id);
    if (!subcategoryData) {
      return res.status(404).send("Not Found");
    }
    subcategoryData = await subcategorySchema.findByIdAndUpdate(req.params.id, { $set: newSubcategory }, { new: true });
    res.json({ subcategoryData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = { SubcategoryInsert, GetSubcategory, DeleteSubcategory, UpdateSubcategory, GetSingleSubcategory };
