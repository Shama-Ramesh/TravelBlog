import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../component/Pages/HomePage";
import SliderLoginForm from "../component/Pages/SliderLoginForm";
import Register from "../component/Pages/Register";
import Appbar from "../component/Appbar/Appbar";
import { Box } from "@mui/material";
import UploadBlog from "../component/Pages/UploadBlog";
import ManageProfile from "../component/Pages/ManageProfile";

import TravelBucketList from "../component/Pages/TravelBucketList";
import CreateBucketList from "../component/Pages/CreateBucketList";
import Blogs from "../component/Pages/Blogs";
import SingleBlog from "../component/Pages/SingleBlog";
import AboutPage from "../component/Pages/AboutPage";
import BookMark from "../component/Pages/BookMark";

const UserRoute = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Appbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/SliderLoginForm" element={<SliderLoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/uploadblog" element={<UploadBlog />} />
        <Route path="/manageprofile" element={<ManageProfile />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/single-blog/:id" element={<SingleBlog />} />

        <Route path="/travelbucketlist" element={<TravelBucketList />} />
        <Route path="/create-bucketlist" element={<CreateBucketList />} />
        <Route path="/bookmarks" element={<BookMark />} />
      </Routes>
    </Box>
  );
};

export default UserRoute;
