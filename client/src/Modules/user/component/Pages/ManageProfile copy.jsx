import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CardActionArea,
  CardMedia,
  Button,
  TextField,
  Input,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import config from "../../../../config";
import Profile from "../widgets/Profile";
import { styled } from "@mui/material/styles";
import {
  ThumbUp as ThumbUpIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const CustomCard = styled(Card)({
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "300px",
  margin: "10px",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const CardHeaderStyled = styled(Typography)({
  fontWeight: "bold",
  color: "#3f51b5",
});

const CardContentText = styled(Typography)({
  color: "#555",
});

const EditButton = styled(IconButton)({
  backgroundColor: "#1199b7",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0f7a8c",
  },
});

const DeleteButton = styled(IconButton)({
  backgroundColor: "#db1640",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#b71c1c",
  },
});

const DialogTitleStyled = styled(DialogTitle)({
  position: "relative",
  padding: "16px 24px",
  background: "#040000 !important",
  color: "#fff",
  borderBottom: "1px solid #ddd",
});

const DialogContentStyled = styled(DialogContent)({
  padding: "24px",
  backgroundColor: "#fafafa",
  borderRadius: "8px",
  textAlign: "left",
});

const ImageDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fafafa",
});

const BlogDetailsContainer = styled(Box)({
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

const BlogTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginBottom: "10px",
});

const BlogContent = styled(Typography)({
  marginBottom: "20px",
});

const BlogMeta = styled(Box)({
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const MetaItem = styled(Typography)({
  color: "#555",
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

const CommentsSection = styled(Box)({
  marginTop: "20px",
});

const Comment = styled(Box)({
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
});

const BlogCard = () => {
  const host = config.host;
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editBlog, setEditBlog] = useState({
    title: "",
    content: "",
    category: "",
    subcategory: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, [host]);

  const fetchBlogs = () => {
    const tokens = JSON.parse(localStorage.getItem("userToken"));
    axios
      .get(`${host}/api/blog/getuserblog`, {
        headers: { "auth-token": tokens },
      })
      .then((res) => {
        setBlogs(res.data);
        console.log(res.data, "blooohh");
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleClickOpen = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  console.log(selectedBlog, "selec");
  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
    setIsEditing(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageOpen(true);
  };

  const handleImageClose = () => {
    setImageOpen(false);
    setSelectedImage("");
  };

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setVideoOpen(true);
  };

  const handleVideoClose = () => {
    setVideoOpen(false);
    setSelectedVideo("");
  };

  const handleEdit = (blog) => {
    setEditBlog({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      subcategory: blog.subcategory,
    });
    setSelectedBlog(blog);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSaveEdit = () => {
    const formData = new FormData();

    // Append text fields
    formData.append("title", editBlog.title);
    formData.append("content", editBlog.content);
    formData.append("category", editBlog.category);
    formData.append("subcategory", editBlog.subcategory);

    // Append image and video files if they exist
    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    if (selectedVideoFile) {
      formData.append("video", selectedVideoFile);
    }

    // Make PUT request with FormData
    axios
      .put(`${host}/api/blog/update/${selectedBlog._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        fetchBlogs();
        setIsEditing(false);

        handleClose();
        setTimeout(() => {
          toast.success("Blog updated successfully!");
        }, 1000);
      })
      .catch((err) => {
        console.log("Error updating blog:", err);
      });
  };

  const handleDelete = (blogId) => {
    axios
      .delete(`${host}/api/blog/delete/${blogId}`)
      .then((res) => {
        fetchBlogs();
        handleClose();
      })
      .catch((err) => {
        console.log("Error deleting blog:", err);
      });
  };

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImageFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setSelectedVideoFile(e.target.files[0]);
  };
  return (
    <div
      style={{
        background: "linear-gradient(to left, #ff5900, #fffbdc,#ff5900)",
        height: "100vh",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          margin: "20px",
          gap: "20px",
        }}
      >
        <Box sx={{ width: "30%" }}>
          <Profile />
        </Box>

        <Box sx={{ width: "70%", height: "100%" }}>
          <Card
            sx={{
              maxWidth: "90%",
              borderRadius: "30px",
              padding: "20px",
              background: "linear-gradient(to left, #f5eee4, #ede9e3)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                padding: "20px 20px 20px 20px",
                fontWeight: "900",
                color: "#f39c12",
              }}
            >
              My Posts/Blogs
            </Typography>
            <Grid container spacing={2}>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Grid item xs={12} sm={6} md={4} key={blog._id}>
                    <CustomCard>
                      <CardActionArea onClick={() => handleClickOpen(blog)}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={
                            `${host}/api/image/${blog.images[0]}` ||
                            "/placeholder.png"
                          }
                          alt={`${host}/api/image/${blog?.images[0]}`}
                        />
                        <CardContent>
                          <CardHeaderStyled
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{ color: "#040000" }}
                          >
                            {blog.title}
                          </CardHeaderStyled>
                          <CardContentText
                            variant="body2"
                            component="p"
                            gutterBottom
                          >
                            <strong>Category:</strong> {blog.category}
                          </CardContentText>
                          <CardContentText variant="body2" component="p">
                            <strong>Subcategory:</strong> {blog.subcategory}
                          </CardContentText>
                          <CardContentText variant="body2" component="p">
                            {blog.content.length > 100
                              ? `${blog.content.substring(0, 100)}...`
                              : blog.content}
                          </CardContentText>
                        </CardContent>
                      </CardActionArea>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          p: 1,
                        }}
                      >
                        <EditButton onClick={() => handleEdit(blog)}>
                          <EditIcon />
                        </EditButton>
                        <DeleteButton onClick={() => handleDelete(blog._id)}>
                          <DeleteIcon />
                        </DeleteButton>
                      </Box>
                    </CustomCard>
                  </Grid>
                ))
              ) : (
                <div style={{ color: "gray", margin: "20px" }}>
                  No Blogs Found
                </div>
              )}
            </Grid>
          </Card>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitleStyled>
          {isEditing ? "Edit Blog" : selectedBlog?.title}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitleStyled>
        <DialogContentStyled>
          {selectedBlog && !isEditing && (
            <BlogDetailsContainer sx={{ margin: "20px" }}>
              <BlogTitle>{selectedBlog.title}</BlogTitle>
              {selectedBlog.videos && (
                <Box sx={{ mb: 2 }}>
                  <video
                    controls
                    width="100%"
                    src={`${host}/api/videos/${selectedBlog.videos[0]}`}
                    onClick={() => handleVideoClick(selectedBlog.videos[0])}
                  />
                </Box>
              )}
              <BlogMeta>
                <MetaItem>
                  <VisibilityIcon fontSize="small" />
                  {selectedBlog?.views}
                </MetaItem>
                <MetaItem>
                  <ThumbUpIcon fontSize="small" />
                  {selectedBlog?.likes.length}
                </MetaItem>
                <MetaItem>
                  <Typography variant="body2">
                    Category: {selectedBlog.category}
                  </Typography>
                </MetaItem>
                <MetaItem>
                  <Typography variant="body2">
                    Subcategory: {selectedBlog.subcategory}
                  </Typography>
                </MetaItem>
              </BlogMeta>
              <BlogContent> {selectedBlog.content}</BlogContent>
              {selectedBlog.images.length > 0 && (
                <Box>
                  <Typography variant="h6">Images:</Typography>
                  <Grid container spacing={2}>
                    {selectedBlog.images.map((image, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={`${host}/api/image/${image}`}
                          alt={`Image ${index}`}
                          onClick={() => handleImageClick(image)}
                          sx={{ borderRadius: "20px" }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <CommentsSection>
                <Typography variant="h6">Comments:</Typography>
                {selectedBlog.comments.length > 0 ? (
                  selectedBlog?.comments?.map((comment, index) => (
                    <Comment key={index}>
                      <Typography variant="body2">
                        <strong>{comment.author}:</strong> {comment.text}
                      </Typography>
                    </Comment>
                  ))
                ) : (
                  <>No Comments Found</>
                )}
              </CommentsSection>
            </BlogDetailsContainer>
          )}

          {isEditing && (
            <Box>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                variant="outlined"
                value={editBlog.title}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, title: e.target.value })
                }
              />
              <TextField
                label="Content"
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                value={editBlog.content}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, content: e.target.value })
                }
              />
              <TextField
                label="Category"
                fullWidth
                margin="normal"
                variant="outlined"
                value={editBlog.category}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, category: e.target.value })
                }
              />
              <TextField
                label="Subcategory"
                fullWidth
                margin="normal"
                variant="outlined"
                value={editBlog.subcategory}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, subcategory: e.target.value })
                }
              />

              {/* <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                sx={{ mt: 2, width: "400px" }}
              />
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                sx={{ mt: 2, width: "400px" }}
              /> */}
              <br />

              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleSaveEdit(selectedImageFile, selectedVideoFile)
                }
                sx={{ mt: 2, background: "#f39c12 !important" }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </DialogContentStyled>
      </Dialog>

      <Dialog
        open={imageOpen}
        onClose={handleImageClose}
        maxWidth="sm"
        fullWidth
      >
        <ImageDialogContent>
          <CardMedia
            component="img"
            height="auto"
            image={`${host}/api/image/${selectedImage}`}
            alt="Selected Image"
          />
        </ImageDialogContent>
      </Dialog>

      <Dialog
        open={videoOpen}
        onClose={handleVideoClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContentStyled>
          <video
            controls
            width="100%"
            src={`${host}/api/video/${selectedVideo}`}
            alt="Selected Video"
          />
        </DialogContentStyled>
      </Dialog>
    </div>
  );
};

export default BlogCard;
