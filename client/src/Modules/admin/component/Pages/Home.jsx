import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { TrendingUp, LocationOn, LibraryBooks } from "@mui/icons-material";
import ReportIcon from "@mui/icons-material/Report";
import axios from "axios";
import config from "../../../../config";
import { useEffect, useState } from "react";
import { setNestedObjectValues } from "formik";
import { Link } from "react-router-dom";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const StatsCard = ({ title, value, icon }) => {
  let color, textColor;
  switch (title) {
    case "Registered Users":
      color = "lightblue";
      textColor = "blue";
      break;
    case "Reported Posts":
      color = "#FA7268";
      textColor = "#450000";
      break;
    case "Total Posts":
      color = "lightgreen";
      textColor = "#0E312F";
      break;
    default:
      color = "inherit";
      textColor = "inherit";
  }

  return (
    <Paper
      sx={{
        padding: 2,
        display: "flex",
        alignItems: "center",
        backgroundColor: color,
      }}
    >
      {icon && <IconButton size="large">{icon}</IconButton>}
      <Box ml={2}>
        <Typography variant="h6" style={{ color: textColor }}>
          {title}
        </Typography>
        <Typography variant="h4" style={{ color: textColor }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

const RecentPosts = ({ data }) => (
  <Paper sx={{ padding: 2, height: "100%", backgroundColor: "#E4FDE1" }}>
    <Typography variant="h6" gutterBottom>
      <strong>Recent Posts</strong>
    </Typography>
    <List>
      {data.map((post, index) => (
        <ListItem key={index}>
          <Tooltip title="Click here to view" arrow>
            <Link to={`/user/single-blog/${post._id}`}>
              <ListItemText primary={post.title}></ListItemText>
            </Link>
            <Typography variant="body2" color="textSecondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  </Paper>
);

const PopularDestinations = ({ data }) => (
  <Paper sx={{ padding: 2, backgroundColor: "#E4FDE1" }}>
    <Typography variant="h6" gutterBottom>
      <strong>Top Travel Spots</strong>
    </Typography>
    <List>
      {data.map((destination, index) => (
        <ListItem key={index}>
          <Avatar sx={{ bgcolor: "#0E312F", mr: 2 }}>
            <TrackChangesIcon />
          </Avatar>
          <ListItemText primary={destination._id} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

const LatestComments = ({ data }) => (
  <Paper sx={{ padding: 2, backgroundColor: "#E4FDE1" }}>
    <Typography variant="h6" gutterBottom>
      <strong>Latest Comments</strong>
    </Typography>
    <List>
      {data.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <Avatar
            alt={comment?.comments?.author?.username}
            src={`${config.host}/api/user-image/${comment?.comments?.author?.image}}`}
            sx={{ backgroundColor: "#0E312F" }}
          />
          <ListItemText
            primary={comment?.comments?.author?.username}
            secondary={comment.comments.text}
            children={comment.comments.createdAt}
            sx={{ ml: 2 }}
          />
          <Typography variant="body2" color="textSecondary">
            {new Date(comment.comments.createdAt).toLocaleString()}
          </Typography>
        </ListItem>
      ))}
    </List>
  </Paper>
);

const UserDemographics = ({ data }) => (
  <Paper sx={{ padding: 2, height: "100%", backgroundColor: "#E4FDE1" }}>
    <Typography variant="h6" gutterBottom>
      <strong>User Demographics</strong>
    </Typography>
    <List>
      {data.map((demographic, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`${demographic?._id} - ${data[index + 1]?._id ?? "++"}`}
          />
          <Typography variant="body2">{demographic.count}</Typography>
        </ListItem>
      ))}
    </List>
  </Paper>
);

const Home = () => {
  const host = config.host;
  const [data, setData] = useState({});
  const [recentPost, setRecentPost] = useState([]);
  const [recentComment, setRecentComment] = useState([]);
  const [destination, setDestination] = useState([]);
  const [demographic, setDemographic] = useState([]);
  useEffect(() => {
    axios
      .get(`${host}/api/report/all`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/api/dashboard/recent-posts`)
      .then((res) => {
        console.log(res.data, "recent");
        setRecentPost(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/api/dashboard/recent-comments`)
      .then((res) => {
        console.log(res.data, "comments");
        setRecentComment(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/api/dashboard/popular-destinations`)
      .then((res) => {
        console.log(res.data, "destination");
        setDestination(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/api/dashboard/user-demographics`)
      .then((res) => {
        console.log(res.data, "demo");
        setDemographic(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: "lightgray" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Registered Users"
            value={data.totalUsers}
            icon={<TrendingUp sx={{ color: "blue" }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Reported Posts"
            value={data.totalReports}
            icon={<ReportIcon sx={{ color: "#450000" }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Posts"
            value={data.totalBlogs}
            icon={<LibraryBooks sx={{ color: "#0E312F" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentPosts data={recentPost} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PopularDestinations data={destination} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatestComments data={recentComment} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserDemographics data={demographic} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
