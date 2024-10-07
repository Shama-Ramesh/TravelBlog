import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemTwoToneIcon from "@mui/icons-material/ReportProblemTwoTone";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CategoryIcon from "@mui/icons-material/Category";
import { Link, useLocation } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import admin from "../../images/admin.jpeg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...openedMixin(theme),
  "& .MuiDrawer-paper": openedMixin(theme),
}));

const Navigation = () => {
  const nav = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const currentRoute = location.pathname;

    if (currentRoute.includes("/admin/manage-category")) {
      setActiveItem("Manage Category");
    } else if (currentRoute.includes("/admin/add-course")) {
      setActiveItem("Manage Course");
    } else if (currentRoute.includes("/admin/")) {
      setActiveItem("Dashboard");
    } else if (currentRoute.includes("/admin/view-user")) {
      setActiveItem("Manage User");
    } else if (currentRoute.includes("/admin/feedback")) {
      setActiveItem("Manage Post Report");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);

  const sideBarList = [
    {
      title: "Dashboard",
      path: "/admin/",
      icon: (
        <DashboardIcon
          sx={{ fontSize: "14px", color: "#fb8c00", color: "white" }}
        />
      ),
      customTextColor: "#FFDD43",
    },
    {
      title: "Manage Category",
      path: "/admin/manage-category",
      icon: <CategoryIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Manage SubCategory",
      path: "/admin/manage-sub-category",
      icon: <ControlCameraIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Manage Reported Post",
      path: "/admin/manage-reports",
      icon: (
        <ReportProblemTwoToneIcon sx={{ fontSize: "14px", color: "white" }} />
      ),
    },
    {
      title: "Manage User",
      path: "/admin/manage-user",
      icon: (
        <SupervisedUserCircleIcon sx={{ fontSize: "14px", color: "white" }} />
      ),
    },

    {
      title: "View Feedback",
      path: "/admin/feedback",
      icon: <ChatBubbleIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    // setCount(!count);
    nav("/admin/login");
    handleMenuClose();
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        open
        className="nav"
        sx={{ backgroundColor: "#0E312F" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "White", fontWeight: "500" }}
          >
            <b>Admin Dashboard</b>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* Profile Avatar */}
          <Avatar
            alt="User Avatar"
            src={admin}
            onClick={handleMenuOpen}
            sx={{ cursor: "pointer" }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open>
        <Box
          className="sidebar-body"
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <DrawerHeader
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "15px",
              }}
            >
              <TravelExploreIcon sx={{ fontSize: "29px", color: "white" }} />
              <Typography variant="h6" sx={{ ml: 1, color: "white" }}>
                <b>TRAVEL BLOG</b>
              </Typography>
            </Box>
          </DrawerHeader>
          <List sx={{ flexGrow: 1 }}>
            {sideBarList.map((item) => (
              <ListItem
                key={item.title}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: "initial",
                      px: 2.5,
                      backgroundColor:
                        activeItem === item.title
                          ? "rgba(68, 206, 66, 0.12)"
                          : "inherit",
                      "&:hover": {
                        backgroundColor: "rgba(68, 206, 66, 0.12)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                        color: activeItem === item.title ? "white" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: 1,
                        color: activeItem === item.title ? "gray" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, color: "white" }}>
            <Typography variant="body1">{formatTime(time)}</Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
