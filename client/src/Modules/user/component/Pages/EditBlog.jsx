import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import Axios from "axios";
import config from "../../../../config";
import backgroundVideo from "../Videos/b5.mp4";

const EditBlog = ({ match, close }) => {
  const host = config.host;
  const blogId = match._id;

  console.log(blogId, "blogId");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [blogData, setBlogData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBlogDetails();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    Axios.get(`${host}/api/category/GetCategory`)
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setLoading(false);
      });
  };

  const fetchSubcategories = () => {
    setLoading(true);
    Axios.get(`${host}/api/subcategory/GetSubcategory`)
      .then((res) => {
        if (res.data) {
          setSubcategories(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setLoading(false);
      });
  };

  const fetchBlogDetails = () => {
    setBlogData(match);
    setImagePreviews(match.images.map((img) => `${host}/api/image/${img}`));
    setVideoPreviews(match.videos.map((vid) => `${host}/api/videos/${vid}`));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setBlogData((prevState) => ({
      ...prevState,
      images: files,
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setBlogData((prevState) => ({
      ...prevState,
      videos: files,
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews(previews);
  };

  const handleRemoveImage = (index) => {
    setBlogData((prevState) => {
      const newImages = prevState.images.filter((_, i) => i !== index);
      return { ...prevState, images: newImages };
    });

    setImagePreviews((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setBlogData((prevState) => {
      const newVideos = prevState.videos.filter((_, i) => i !== index);
      return { ...prevState, videos: newVideos };
    });

    setVideoPreviews((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("category", blogData.category);
    formData.append("subcategory", blogData.subcategory);

    // Append images
    blogData.images.forEach((image) => {
      formData.append("images", image);
    });

    // Append videos
    blogData.videos.forEach((video) => {
      formData.append("videos", video);
    });

    const tokens = JSON.parse(localStorage.getItem("userToken"));

    Axios.put(`${host}/api/blog/update/${blogId}`, formData)
      .then((res) => {
        if (res.data) {
          setSnackbar({
            open: true,
            message: "Blog updated successfully",
            severity: "success",
          });
        }
        setLoading(false);
        setTimeout(() => {
          close();
        }, 1000);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setSnackbar({
          open: true,
          message: "Failed to update blog",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  console.log(imagePreviews, "blogData");

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderRadius: 3,
          p: 4,
          boxShadow: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Edit Your Blog
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Update the details of your blog.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleBlogSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Blog Title"
                name="title"
                value={blogData.title}
                onChange={(e) =>
                  setBlogData({ ...blogData, title: e.target.value })
                }
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={blogData.category}
                  onChange={(e) =>
                    setBlogData({ ...blogData, category: e.target.value })
                  }
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory"
                  value={blogData.subcategory}
                  onChange={(e) =>
                    setBlogData({ ...blogData, subcategory: e.target.value })
                  }
                  label="Subcategory"
                >
                  {subcategories.map((subcategory) => (
                    <MenuItem
                      key={subcategory._id}
                      value={subcategory.subcategory}
                    >
                      {subcategory.subcategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={blogData.content}
                onChange={(e) =>
                  setBlogData({ ...blogData, content: e.target.value })
                }
                margin="normal"
                multiline
                rows={6}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#040000 !important",
                  color: "white",
                  "&:hover": { backgroundColor: "#44658E", color: "#C5D0DE" },
                }}
              >
                Upload Images
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#040000 !important",
                  color: "white",
                  "&:hover": { backgroundColor: "#44658E", color: "#C5D0DE" },
                }}
              >
                Upload Videos
                <input
                  name="videos"
                  type="file"
                  accept="video/*"
                  hidden
                  multiple
                  onChange={handleVideoChange}
                />
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Image Previews
            </Typography>
            <Grid container spacing={2}>
              {imagePreviews.map((preview, index) => (
                <Grid item xs={12} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      width: "100%",
                      height: "auto",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        borderRadius: "0 0 0 8px",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Video Previews
            </Typography>
            <Grid container spacing={2}>
              {videoPreviews.map((preview, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      width: "100%",
                      height: "auto",
                    }}
                  >
                    <video
                      src={preview}
                      controls
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        borderRadius: "0 0 0 8px",
                      }}
                      onClick={() => handleRemoveVideo(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#040000 !important",
              color: "white",
              "&:hover": { backgroundColor: "#44658E", color: "#C5D0DE" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress color="inherit" /> : "Update"}
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditBlog;
