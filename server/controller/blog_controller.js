// controllers/blogController.js
const Blog = require("../model/blog_model");

// Function to handle blog creation
const createBlog = async (req, res) => {
  try {
    const { title, content, category, subcategory } = req.body;
    const images = req.files ? req.files.filter((i)=>i.fieldname === 'images').map((file) => file.filename ) : [];
    const videos = req.files ? req.files.filter((i)=>i.fieldname === 'videos').map((file) => file.filename ) : [];
    

    console.log(req.user, 8789);
    let img = [];
    let vdo = [];
    req.files.forEach((element, index) => {

    });

    console.log(images,89899)
    console.log(videos,77799)

    const newBlog = new Blog({
      title,
      content,
      category,
      subcategory,
      user:req.user,
      images,
      videos,
    });

    await newBlog.save();
    res.status(200).json({ message: "Blog uploaded successfully" });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ message: "Failed to upload blog" });
  }
};
const GetUserBlog = async (req, res) => {
  try {
    // Extract user ID from req.user
    const userId = req.user; // Adjust this if req.user structure is different
    console.log('User ID:', userId);
    
    // Find blogs associated with the user ID
    const blogs = await Blog.find({ user: userId })
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    });
    // Return the found blogs as JSON
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching user blogs:', err);
    res.status(500).send('Server error');
  }
};
const GetBlog = async (req, res) => {
  try {
    console.log("object")
    const blog = await Blog.find().populate('category', 'category').populate('subcategory', 'subcategory').populate('user').exec();
    res.send(blog);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

// const updateBlog = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const { title, content, category, subcategory } = req.body;
//     console.log(req.files,"hh");
//     const images = req.files ? req.files.filter((i)=>i.fieldname === 'images').map((file) => file.filename ) : [];
//     const videos = req.files ? req.files.filter((i)=>i.fieldname === 'videos').map((file) => file.filename ) : [];

//     console.log(images);

//     const updatedBlog = {
//       title,
//       content,
//       category,
//       subcategory,
//     };

//     // If new files are uploaded, add them to the update object
//     if (images.length > 0) updatedBlog.images = images;
//     if (videos.length > 0) updatedBlog.videos = videos;

//     const blog = await Blog.findByIdAndUpdate(blogId, updatedBlog, { new: true });

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     res.status(200).json({ message: "Blog updated successfully", blog });
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     res.status(500).json({ message: "Failed to update blog" });
//   }
// };

// const updateBlog = async (req, res) => {
//   const { id } = req.params;
//   const { title, content, category, subcategory } = req.body;
//   const image = req.files?.image ? req.files.image[0].path : undefined;
//   const video = req.files?.video ? req.files.video[0].path : undefined;

//   try {
//     const blog = await Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     blog.title = title || blog.title;
//     blog.content = content || blog.content;
//     blog.category = category || blog.category;
//     blog.subcategory = subcategory || blog.subcategory;

//     if (image) {
//       blog.images.push(image);
//     }

//     if (video) {
//       blog.videos.push(video);
//     }

//     blog.updatedAt = Date.now();

//     await blog.save();

//     res.status(200).json({ message: 'Blog updated successfully', blog });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };


// Add like to a blog
// Add or remove like to/from a blog


const updateBlog = async (req, res) => {
  const { id } = req.params;
 
  const { title, content, category, subcategory } = req.body;
  const images = req.files ? req.files.filter((i)=>i.fieldname === 'images').map((file) => file.filename ) : [];
    const videos = req.files ? req.files.filter((i)=>i.fieldname === 'videos').map((file) => file.filename ) : [];
    
  console.log(images,"hh");
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.subcategory = subcategory || blog.subcategory;
    if(images.length>0){
      blog.images=images
    }
    if(videos.length>0){
      blog.videos=videos
    }
    // blog.images = images || blog.images;
    // blog.videos = videos || blog.videos;
    blog.updatedAt = Date.now();

    await Blog.findByIdAndUpdate(id,{$set:blog},{$new:true})

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user; // Ensure req.user contains the user ID

    // Find the blog
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Initialize likes array if it is undefined
    if (!blog.likes) {
      blog.likes = [];
    }

    // Check if the user has already liked the blog
    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      // Remove the user's ID from the likes array
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
      await blog.save();
      res.status(200).json({ message: "Blog unliked successfully", likes: blog.likes });
    } else {
      // Add the user's ID to the likes array and save
      blog.likes.push(userId);
      await blog.save();
      res.status(200).json({ message: "Blog liked successfully", likes: blog.likes });
    }
  } catch (error) {
    console.error("Error liking/unliking blog:", error);
    res.status(500).json({ message: "Failed to like/unlike blog" });
  }
};


// Update views count of a blog
const updateViews = async (req, res) => {
  try {
    const blogId = req.params.id;
    let user_id=req.user

    // Find the blog and increment the view count
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({ message: "Views updated successfully", views: blog.views ,id:user_id});
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ message: "Failed to update views" });
  }
};



module.exports = {
  createBlog,GetBlog,deleteBlog,updateBlog,GetUserBlog,updateViews,likeBlog
};




// // controllers/blogController.js
// const Blog = require("../model/blog_model");

// // Function to handle blog creation
// const createBlog = async (req, res) => {
//   try {
//     const { title, content, category, subcategory } = req.body;
//     const images = req.files ? req.files.filter((i)=>i.fieldname === 'images').map((file) => file.filename ) : [];
//     const videos = req.files ? req.files.filter((i)=>i.fieldname === 'videos').map((file) => file.filename ) : [];
    

//     console.log(req.files, 8789);
//     let img = [];
//     let vdo = [];
//     req.files.forEach((element, index) => {

//     });

//     console.log(images,89899)
//     console.log(videos,77799)

//     const newBlog = new Blog({
//       title,
//       content,
//       category,
//       subcategory,
//       user:req.user,
//       images,
//       videos,
//     });

//     await newBlog.save();
//     res.status(200).json({ message: "Blog uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading blog:", error);
//     res.status(500).json({ message: "Failed to upload blog" });
//   }
// };
// const GetBlog = async (req, res) => {
//   try {
//     console.log("object")
//     const blog = await Blog.find().populate('category', 'category').populate('subcategory', 'subcategory').exec();
//     res.send(blog);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal server error");
//   }
// };


// const deleteBlog = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     await Blog.findByIdAndDelete(blogId);
//     res.status(200).json({ message: "Blog deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting blog:", error);
//     res.status(500).json({ message: "Failed to delete blog" });
//   }
// };

// const updateBlog = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const { title, content, category, subcategory } = req.body;
//     const images = req.files ? req.files.filter((i)=>i.fieldname === 'images').map((file) => file.filename ) : [];
//     const videos = req.files ? req.files.filter((i)=>i.fieldname === 'videos').map((file) => file.filename ) : [];

//     const updatedBlog = {
//       title,
//       content,
//       category,
//       subcategory,
//     };

//     // If new files are uploaded, add them to the update object
//     if (images.length > 0) updatedBlog.images = images;
//     if (videos.length > 0) updatedBlog.videos = videos;

//     const blog = await Blog.findByIdAndUpdate(blogId, updatedBlog, { new: true });

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     res.status(200).json({ message: "Blog updated successfully", blog });
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     res.status(500).json({ message: "Failed to update blog" });
//   }
// };

// module.exports = {
//   createBlog,GetBlog,deleteBlog,updateBlog
// };
