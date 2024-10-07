import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "../component/Nav/Navigation";
import Box from "@mui/material/Box";
import Home from "../component/Pages/Home";
import { styled, useTheme } from "@mui/material/styles";
import "../css/Style.css";

import CssBaseline from "@mui/material/CssBaseline";
import ManageCourse from "../component/Pages/ManageCourse";
import AddCourse from "../component/Pages/AddCourse";
import ViewChapters from "../component/Pages/ViewChapters";
import UpdateCourse from "../component/Pages/UpdateCourse";
import ManageCategory from "../component/Pages/ManageCategory";
import Login from "../component/Pages/Login";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ManageUser from "../component/Pages/ManageUser";
import ManageReports from "../component/Pages/ManageReports";
import ManageSubCategory from "../../user/component/Pages/ManageSubCategory";
import Feedback from "../component/Pages/Feedback";

export default function AdminRoute() {
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("adminToken")) == null) {
      navigate("/admin/login");
    }
  }, []);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {currentRoute.includes("/admin/login") ? (
          <Box>
            <Routes>
              <Route exact path="/login" element={<Login />} />
            </Routes>
          </Box>
        ) : (
          <Navigation />
        )}

        {currentRoute.includes("/admin/login") ? (
          ""
        ) : (
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, background: "#f0f1f6" }}
          >
            <DrawerHeader />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                exact
                path="/manage-category"
                element={<ManageCategory />}
              />
              <Route
                exact
                path="/manage-sub-category"
                element={<ManageSubCategory />}
              />
              <Route exact path="/manage-user" element={<ManageUser />} />
              <Route exact path="/manage-reports" element={<ManageReports />} />
              <Route exact path="/add-course" element={<AddCourse />} />
              <Route
                exact
                path="/view-chapter/:id"
                element={<ViewChapters />}
              />
              <Route
                exact
                path="/update-course/:id"
                element={<UpdateCourse />}
              />

              <Route exact path="/feedback/" element={<Feedback />} />
            </Routes>
          </Box>
        )}
      </Box>
    </div>
  );
}
