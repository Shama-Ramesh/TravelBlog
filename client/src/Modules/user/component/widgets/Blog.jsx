import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import config from "../../../../config";
import { Link } from "react-router-dom";

const Blog = ({
  title,
  content,
  images,
  date,
  author,
  _id,
  category,
  subcategory,
  views,
  likes,
}) => {
  const host = config.host;

  return (
    <Card
      sx={{
        maxWidth: 360,
        margin: 2,
        borderRadius: 2,
        boxShadow: 5,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        sx={{
          height: 200,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        image={`${host}/api/image/${images[0]}`}
        title={title}
      />
      <CardContent
        sx={{
          textAlign: "left",
          padding: 2,
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            height: 60,
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 1,
          }}
        >
          {content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            marginTop: 1,
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          {author} - {date}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            marginTop: 1,
            color: "text.primary",
            fontWeight: 500,
          }}
        >
          Category: {category} | Subcategory: {subcategory}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            marginTop: 1,
            color: "text.primary",
          }}
        >
          Views: {views} | Likes: {likes}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Share
        </Button>
        <Link
          to={`/user/single-blog/${_id}`}
          style={{
            textDecoration: "none",
            color: "#1976d2", // Adjust the color to match your theme
            fontWeight: 600,
          }}
        >
          Learn More
        </Link>
      </CardActions>
    </Card>
  );
};

export default Blog;
