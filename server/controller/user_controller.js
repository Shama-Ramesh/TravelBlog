const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/user_model');
const key = "Hello";

// Configure multer for single file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename with a timestamp
  }
});

const upload = multer({ storage });

// User Register with Image Upload
const UserRegister = async (req, res) => {
  try {

    // Handle file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).send('Error uploading file.');
      }

      const { username, age, email, password } = req.body;
      const image = req.file ? req.file.filename : null; // Save image path if file is uploaded

      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(password, salt);

      const newUser = new userSchema({
        username,
        age,
        email,
        password: secpass,
        image
      });

      const registeredUser = await newUser.save();
      res.json(registeredUser);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};



// const UpdateUser = async (req, res) => {
//   try {
//     // Handle file upload if present
//     const handleFileUpload = () => {
//       return new Promise((resolve, reject) => {
//         upload.single('image')(req, res, (err) => {
//           if (err) {
//             return reject(new Error('Error uploading file.'));
//           }
//           resolve();
//         });
//       });
//     };

//     // Upload file if needed
//     if (req.file) {
//       await handleFileUpload();
//     }

//     console.log(req.body,"bb");
//     const { username, phone, address, email, password } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const updates = {};
//     if (username) updates.username = username;
//     if (phone) updates.phone = phone;
//     if (email) updates.email = email;
//     if (address) updates.address = address;
//     if (image) updates.image = image;

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(password, salt);
//     }

//     // Assuming req.user is the logged-in user's ID
//     const userId = req.user; 
//     let user = await userSchema.findById(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     user = await userSchema.findByIdAndUpdate(userId, { $set: updates }, { new: true });
//     res.json(user);
//   } catch (error) {
//     console.error('Internal server error:', error.message);
//     res.status(500).send("Internal server error");
//   }
// };




// update

const updateUserProfile = async (req, res) => {
  try {
    // Handle file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error' });
      }

      const userId = req.user; // Assuming req.user.id is set after authentication
      const { username, email, phone, address } = req.body;

      const updateData = {
        username,
        email,
        phone,
        address,
      };

      if (req.file) {
        updateData.image = req.file.filename.replace(/\\/g, '/');
      }

      const updatedUser = await userSchema.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// User Login
const UserLogin = async (req, res) => {
  try {
    console.log("req",req.body)
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id }, key);
    res.json({ token, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

// Insert User (can be used for manual entry, if needed)
const UserInsert = async (req, res) => {
  try {
    const { username, age, email, password } = req.body;
    const newUser = new userSchema({ username, age, email, password });
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch All Users
const GetUser = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Fetch Single User
const GetSingleUser = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// get profile
const GetProfile = async (req, res) => {
  try {
    let user_id=req.user
    console.log(user_id,"fghj")
    const user = await userSchema.findById(user_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

// Delete User
const DeleteUser = async (req, res) => {
  try {
    let user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    await userSchema.findByIdAndDelete(req.params.id);
    res.json({ success: "User deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};







// Update user status
const updateUserStatus = async (req, res) => {
  const {status } = req.body;
  const userId=req.params.id

  try {
    // Find user by ID and update the status
    const user = await userSchema.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};







module.exports = {
  UserInsert,
  GetUser,
  DeleteUser,

  GetSingleUser,
  UserRegister,
  UserLogin,
  GetProfile,
  updateUserStatus,
  updateUserProfile
};
