import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Divider,
  Grid,
  Avatar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../../config";
import Header from "../../component/widgets/Header";
import styled from "styled-components";
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";
import ReportIcon from "@mui/icons-material/Report";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
`;

const StyledCardMedia = styled(CardMedia)`
  height: 500px;
  border-radius: 20px 20px 0 0;
`;

const BlogTitle = styled(Typography)`
  font-weight: bold;
  color: #ffa500;
  margin-bottom: 8px;
`;

const BlogSubtitle = styled(Typography)`
  color: #ffa500;
  margin-bottom: 16px;
`;

const BlogContent = styled(Typography)`
  color: #000;
  margin-bottom: 16px;
`;

const BlogImage = styled(CardMedia)`
  border-radius: 10px;
`;

const StatsBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #000;
`;

const CommentsSection = styled(Box)`
  margin-top: 32px;
`;

const CommentBox = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  border-radius: 10px;
  padding: 16px;
  background-color: #f0f0f0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const CommentAvatar = styled(Avatar)`
  background-color: #ffa500;
  margin-right: 16px;
`;

const CommentInputBox = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 16px;
  border-radius: 10px;
  padding: 16px;
  background-color: #f0f0f0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const BlogDetails = styled(Box)`
  padding: 4px;
  color: #000;
`;

const SingleBlog = () => {
  const host = config.host;
  const { id } = useParams();
  const nav = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasLiked, setHasLiked] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let token = JSON.parse(localStorage.getItem("userToken"));
      if (!token) {
        nav("/user/SliderLoginForm");
      }
      try {
        // Increment the view count
        let resp = await axios.post(
          `${host}/api/blog/views/${id}`,
          {},
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        // Fetch the blog details
        const res = await axios.get(`${host}/api/blog/getblog`);
        const data = res?.data?.find((item) => item._id === id);
        if (data) {
          setBlog(data);
        }

        const userid = resp.data.id;

        const filteredLikes = data.likes.filter((item) => item == userid); // Filter arrays containing `userid`

        // Check if any array was found
        const isLiked = filteredLikes.length > 0;
        console.log(isLiked, "liked");
        console.log(userid, "id");
        setHasLiked(isLiked);

        // Fetch the comments
        const commentsRes = await axios.get(
          `${host}/api/comment/blogs/comments/${id}`
        );
        setComments(commentsRes.data);

        // fetch bookmark
        const bookmarkRes = await axios.get(`${host}/api/bookmark/bookmarks`, {
          headers: {
            "auth-token": token,
          },
        });

        const dataBook = bookmarkRes.data.filter((item) => item.blog._id == id);

        if (dataBook.length > 0) {
          setIsBookmarked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  console.log("b", blog);
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        let token = JSON.parse(localStorage.getItem("userToken"));
        const response = await axios.post(
          `${host}/api/comment/comments/${id}`,
          { text: newComment },
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        setComments([...comments, response.data.comment]);
        setNewComment("");
        toast.success("Comment Added successfully!");
      } catch (error) {
        toast.error("Failed to add comment.");
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLike = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("userToken"));
      let response;

      if (hasLiked) {
        response = await axios.post(
          `${host}/api/blog/likes/${id}`, // Ensure the correct endpoint for unliking
          {},
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        toast.success("Likes updated successfully!");
        setHasLiked(!hasLiked);
      } else {
        response = await axios.post(
          `${host}/api/blog/likes/${id}`, // Ensure the correct endpoint for liking
          {},
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        toast.success("Likes updated successfully!");

        setHasLiked(!hasLiked);
      }

      console.log(response.data.likes, "lk");

      setBlog((prevBlog) => ({
        ...prevBlog,
        likes: response.data.likes, // Update like count from server response
      }));

      // Toggle like status
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      let token = JSON.parse(localStorage.getItem("userToken"));
      if (!isBookmarked) {
        await axios.post(
          `${host}/api/bookmark/bookmarks/${id}`,
          {},
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        toast.success("Bookmarks Added successfully!");
      } else {
        let token = JSON.parse(localStorage.getItem("userToken"));

        await axios.delete(`${host}/api/bookmark/delete-bookmarks/${id}`, {
          headers: {
            "auth-token": token,
          },
        });
        toast.success("Bookmarks Removed successfully!");
      }
    } catch (error) {
      console.error("Error bookmarking blog:", error);
    }
  };

  if (!blog) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  console.log(blog, "blog");

  return (
    <>
      <ToastContainer />

      <Header />
      <Box sx={{ padding: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <StyledCard>
              {blog.videos && blog.videos.length > 0 && (
                <StyledCardMedia
                  component="video"
                  src={`${host}/api/videos/${blog.videos[0]}`}
                  controls
                />
              )}
              <CardContent>
                <BlogTitle variant="h4">{blog?.title || "No Title"}</BlogTitle>

                <BlogSubtitle variant="subtitle1">
                  {blog?.category || "No Category"} /{" "}
                  {blog?.subcategory || "No Subcategory"}
                  <IconButton
                    onClick={() => setReportOpen(true)}
                    sx={{ color: "red" }}
                  >
                    <ReportIcon />
                  </IconButton>
                </BlogSubtitle>
                <StatsBox>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      aria-label="likes"
                      sx={{ color: hasLiked ? "#ffa500" : "#040000" }}
                      onClick={handleLike}
                    >
                      <Tooltip title="like" arrow>
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                    <Typography variant="body2">
                      {blog?.likes?.length || 0}
                    </Typography>
                    <IconButton aria-label="comments" sx={{ color: "#ffa500" }}>
                      <Tooltip title="comment" arrow>
                        <CommentIcon />
                      </Tooltip>
                    </IconButton>
                    <Typography variant="body2">
                      {comments.length || 0}
                    </Typography>
                    <IconButton aria-label="views" sx={{ color: "#ffa500" }}>
                      <Tooltip title="views" arrow>
                        <VisibilityIcon />
                      </Tooltip>
                    </IconButton>
                    <Typography variant="body2">{blog.views || 0}</Typography>
                    <IconButton
                      aria-label="bookmark"
                      sx={{ color: isBookmarked ? "#ffa500" : "#000" }}
                      onClick={handleBookmark}
                    >
                      <Tooltip title="bookmark" arrow>
                        <BookmarkIcon />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </StatsBox>
                <Divider sx={{ marginBottom: 2, backgroundColor: "#ffa500" }} />
                <BlogContent variant="body1">
                  {blog?.content || "No Content"}
                </BlogContent>
                <Divider sx={{ marginY: 2, backgroundColor: "#ffa500" }} />
                <Grid container spacing={2}>
                  {blog?.images?.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <BlogImage
                        component="img"
                        height="200"
                        image={`${host}/api/image/${image}`}
                        alt={`blog image ${index + 1}`}
                        onClick={() => {
                          setPreviewImage(`${host}/api/image/${image}`);
                          setPreviewOpen(true);
                        }}
                        sx={{ cursor: "pointer" }} // Makes it clear that the image is clickable
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <BlogDetails>
              <Typography variant="h5" sx={{ color: "#ffa500", mb: 2 }}>
                Blog Details
              </Typography>
              <Divider sx={{ backgroundColor: "#ffa500", mb: 2 }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Title:{" "}
                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {blog.title}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Category:{" "}
                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {blog.category}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Subcategory:{" "}
                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {blog.subcategory}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Created At:{" "}
                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Updated At:{" "}
                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                Author:{" "}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#000",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt={blog?.user?.username || "Unknown"}
                    src={
                      `${host}/api/user-image/${blog?.user?.image}` ||
                      "/path/to/default/avatar.jpg"
                    }
                    sx={{ width: 50, height: 50, mr: 1, marginLeft: 2 }}
                  />

                  {blog?.user?.status === "Approved" && (
                    <>
                      <Tooltip title="Verified" arrow>
                        <CheckCircleOutline
                          sx={{ color: "green", ml: 1, mr: 1 }}
                          title="verified"
                        />
                      </Tooltip>
                    </>
                  )}
                  {blog?.user?.username || "Unknown"}
                </Typography>
              </Typography>
              <Divider sx={{ backgroundColor: "#ffa500", mt: 2 }} />
            </BlogDetails>
            <CommentsSection>
              <Typography variant="h5" sx={{ color: "#ffa500", mb: 2 }}>
                Comments
              </Typography>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <CommentBox key={index}>
                    <CommentAvatar
                      src={`${host}/api/user-image/${comment?.author?.image}`}
                    >
                      {!comment?.author?.avatarUrl &&
                        comment?.author?.username?.charAt(0).toUpperCase()}
                    </CommentAvatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#000",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {comment?.author?.status == "Approved" ? (
                          <>
                            <Tooltip title="Verified" arrow>
                              <CheckCircleOutline sx={{ color: "green" }} />
                            </Tooltip>
                          </>
                        ) : (
                          ""
                        )}
                        {comment.author?.username}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#000" }}>
                        {comment.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#555" }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CommentBox>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#000" }}>
                  No comments yet.
                </Typography>
              )}
              <CommentInputBox>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleAddComment}
                        sx={{ color: "#ffa500" }}
                      >
                        <SendIcon />
                      </IconButton>
                    ),
                  }}
                />
              </CommentInputBox>
            </CommentsSection>
          </Grid>
        </Grid>
        <Dialog open={reportOpen} onClose={() => setReportOpen(false)}>
          <DialogTitle>Report Blog</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for reporting"
              type="text"
              fullWidth
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (reportReason.trim()) {
                  try {
                    let token = JSON.parse(localStorage.getItem("userToken"));
                    await axios.post(
                      `${host}/api/report/report`,
                      { blogId: id, reason: reportReason },
                      {
                        headers: {
                          "auth-token": token,
                        },
                      }
                    );
                    setReportOpen(false);
                    setReportReason("");
                    toast.success("Report Submitted successfully!");
                  } catch (error) {
                    console.error("Error reporting blog:", error);
                  }
                }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="sm"
          height="70%"
          fullWidth
        >
          {/* <DialogTitle>Image Preview</DialogTitle> */}
          <DialogContent>
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SingleBlog;
