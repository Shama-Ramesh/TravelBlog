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
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let token = JSON.parse(localStorage.getItem("userToken"));
      try {
        // Increment the view count
        await axios.post(
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
      } catch (error) {
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
      }

      setBlog((prevBlog) => ({
        ...prevBlog,
        likes: response.data.likes, // Update like count from server response
      }));
      setHasLiked(!hasLiked); // Toggle like status
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
      } else {
        let token = JSON.parse(localStorage.getItem("userToken"));

        await axios.delete(`${host}/api/bookmark/delete-bookmarks/${id}`, {
          headers: {
            "auth-token": token,
          },
        });
      }
    } catch (error) {
      console.error("Error bookmarking blog:", error);
    }
  };

  if (!blog) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <>
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
                </BlogSubtitle>
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
                      />
                    </Grid>
                  ))}
                </Grid>
                <StatsBox>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      aria-label="likes"
                      sx={{ color: hasLiked ? "#000" : "#ffa500" }}
                      onClick={handleLike}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <Typography variant="body2">{blog.likes || 0}</Typography>
                    <IconButton aria-label="comments" sx={{ color: "#ffa500" }}>
                      <CommentIcon />
                    </IconButton>
                    <Typography variant="body2">
                      {comments.length || 0}
                    </Typography>
                    <IconButton aria-label="views" sx={{ color: "#ffa500" }}>
                      <VisibilityIcon />
                    </IconButton>
                    <Typography variant="body2">{blog.views || 0}</Typography>
                    <IconButton
                      aria-label="bookmark"
                      sx={{ color: isBookmarked ? "#ffa500" : "#000" }}
                      onClick={handleBookmark}
                    >
                      <BookmarkIcon />
                    </IconButton>
                  </Box>
                </StatsBox>
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
                    sx={{ width: 50, height: 50, mr: 1 }}
                  />

                  {blog.user.status === "Approved" && (
                    <CheckCircleOutline sx={{ color: "green", ml: 1, mr: 1 }} />
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
                        {comment.author.status == "Approved" ? (
                          <CheckCircleOutline sx={{ color: "green" }} />
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
      </Box>
    </>
  );
};

export default SingleBlog;
