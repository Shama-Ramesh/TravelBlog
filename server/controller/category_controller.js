const categorySchema = require('../model/category_model');

// Insert the data
const CategoryInsert = async (req, res) => {
  try {
    const {category } = req.body;
    const CategoryInfo = new categorySchema({ category });
    const categorySaved = await CategoryInfo.save();
    res.send(categorySaved);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch the data
const GetCategory = async (req, res) => {
  try {
    console.log("object")
    const category = await categorySchema.find();
    res.send(category);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch a single category by ID
const GetSingleCategory = async (req, res) => {
  try {
    const category = await categorySchema.findById(req.params.id);
    res.send(category);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Delete the data
const DeleteCategory = async (req, res) => {
  try {
    const category = await categorySchema.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json({ success: true, message: "Category deleted successfully", category });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
};

// Update the data
const UpdateCategory = async (req, res) => {
  
  try {
    let {category} = req.body;
    let newCategory = {};
   
    if (category) newCategory.category = category;
    

    let categoryData = await categorySchema.findById(req.params.id);
    if (!categoryData) {
      return res.status(404).send("Not Found");
    }
    categoryData = await categorySchema.findByIdAndUpdate(req.params.id, { $set: newCategory }, { new: true });
    res.json({ categoryData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = { CategoryInsert, GetCategory, DeleteCategory, UpdateCategory, GetSingleCategory };
