import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  CardMedia,
  Box,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import config from "../../../../config";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const BlogBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const host = config.host;

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        let token = JSON.parse(localStorage.getItem("userToken"));
        const response = await axios.get(`${host}/api/bookmark/bookmarks`, {
          headers: { "auth-token": token },
        });
        setBookmarks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookmarks");
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [bookmarks]);

  console.log(bookmarks, "fg");
  const handleRemove = async (id) => {
    try {
      let token = JSON.parse(localStorage.getItem("userToken"));

      let response = await axios.delete(
        `${host}/api/bookmark/delete-bookmarks/${id}`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      console.log(response, "res");
      setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
    } catch (err) {
      setError("Failed to remove bookmark");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div
      style={{
        height: "100vh",
        padding: "20px",
        background:
          "linear-gradient(to bottom left,#ffffff,#ffffff, #ff7f00, #ffffff,#ffffff)",
      }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        <Typography
          variant="h5"
          sx={{ color: "#333", fontWeight: "600", margin: "20px" }}
        >
          My Bookmarks
        </Typography>
        <Grid container spacing={3}>
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={bookmark._id}>
                  {bookmark.blog ? (
                    <>
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          transition: "0.3s",
                          boxShadow: 3,
                          borderColor: "black",
                          backgroundColor: "gray.100", // Light gray background
                          "&:hover": {
                            boxShadow: 6,
                            transform: "scale(1.02)",
                            borderColor: "orange",
                          },
                          borderRadius: 2,
                          height: "300px",
                          overflow: "hidden", // To ensure rounded corners don't overlap content
                        }}
                      >
                        {/* Blog Image */}
                        {bookmark.blog.images && (
                          <CardMedia
                            component="img"
                            alt={bookmark.blog.title}
                            height="140"
                            image={`${host}/api/image/${bookmark.blog.images[0]}`}
                            sx={{ objectFit: "cover" }}
                          />
                        )}
                        <CardContent>
                          <Link
                            to={`/user/single-blog/${bookmark.blog._id}`}
                            underline="none"
                          >
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ fontWeight: "bold", color: "black" }}
                            >
                              {bookmark.blog.title}
                            </Typography>
                          </Link>
                          <Box
                            sx={{
                              maxHeight: "4.5em", // Limit height to fit approximately 3 lines of text
                              overflow: "hidden",
                              position: "relative",
                              height: "300px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="gray.700"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2, // Show only 3 lines
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis", // Add ellipsis (...) at the end of the truncated text
                              }}
                            >
                              {bookmark.blog.content}
                            </Typography>
                            <Link
                              to={`/user/single-blog/${bookmark.blog._id}`}
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                background: "rgba(255, 255, 255, 0.7)",
                                padding: "0.5em",
                                borderRadius: "0 0 0 8px",
                                color: "orange",
                                textDecoration: "none",
                                fontWeight: "bold",
                              }}
                            >
                              Read More
                            </Link>
                          </Box>
                        </CardContent>
                        <Tooltip title="Remove Bookmark" arrow>
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              color: "error.main",
                              transition: "0.3s",
                              "&:hover": {
                                color: "darkorange", // Darker shade of orange
                              },
                            }}
                            onClick={() => handleRemove(bookmark?._id)}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            color: "orange",
                            transition: "0.3s",
                            "&:hover": {
                              color: "darkorange",
                            },
                          }}
                          disabled
                        >
                          <BookmarkIcon />
                        </IconButton>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          transition: "0.3s",
                          boxShadow: 3,
                          borderColor: "black",
                          backgroundColor: "gray.100", // Light gray background
                          "&:hover": {
                            boxShadow: 6,
                            transform: "scale(1.02)",
                            borderColor: "orange",
                            height: "300px;",
                          },
                        }}
                      >
                        <CardContent sx={{ height: "260px" }}>
                          <ErrorOutlineIcon sx={{ color: "red" }} />

                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: "bold", color: "red" }}
                          >
                            Blog Details not Found
                          </Typography>
                        </CardContent>
                        <Tooltip title="Remove Bookmark" arrow>
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              color: "error.main",
                              transition: "0.3s",
                              "&:hover": {
                                color: "darkorange", // Darker shade of orange
                              },
                            }}
                            onClick={() => handleRemove(bookmark?._id)}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Tooltip>
                      </Card>
                    </>
                  )}
                </Grid>
              );
            })
          ) : (
            <Typography
              variant="body1"
              color="gray.700"
              sx={{
                textAlign: "center",
                color: "gray",
                marginLeft: "600px",
                marginTop: "50px",
              }}
            >
              No bookmarks found.
            </Typography>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default BlogBookmarks;
