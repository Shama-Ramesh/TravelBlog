import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const pages = [
  { title: "Home", path: "/user/" },
  { title: "About", path: "/user/about" },
  { title: "Blogs", path: "/user/blogs" },
];

const authPages = [
  { title: "Manage Profile", path: "/user/manageprofile" },
  { title: "Upload Blog", path: "/user/uploadblog" },
  { title: "Travel Bucket List", path: "/user/travelbucketlist" },
  { title: "My Bookmarks", path: "/user/bookmarks" },
];

export default function Appbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLoginNavigation = () => {
    navigate("/user/SliderLoginForm");
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsAuthenticated(false);
    navigate("/user");
  };

  const handleOpenProfileMenu = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <EmojiNatureIcon sx={{ marginRight: 1, marginTop: 0 }} />
            TRAVEL BLOG
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => handlePageNavigation(page.path)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            <LocalPrintshopIcon sx={{ marginRight: 1, marginTop: 0 }} />
            PrintWorkHub
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", justifyContent: "end" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handlePageNavigation(page.path)}
                sx={{
                  my: 2,
                  mr: 4,
                  color: "white",
                  display: "block",
                  fontFamily: "roman",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  "&:hover": {
                    color: "#4caf50",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          {isAuthenticated ? (
            <Box>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex", // Use flex display
                  alignItems: "center", // Align items in the center vertically
                  "&:hover": { color: "#4caf50" },
                }}
                onClick={handleOpenProfileMenu}
              >
                <AccountCircleIcon sx={{ marginRight: 1 }} />
                My Profile
              </Button>
              <Menu
                anchorEl={anchorElProfile}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElProfile)}
                onClose={handleCloseProfileMenu}
              >
                {authPages.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => handlePageNavigation(page.path)}
                  >
                    {page.title}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              sx={{
                my: 2,
                color: "white",
                display: "block",
                "&:hover": { color: "#4caf50" },
              }}
              onClick={handleLoginNavigation}
            >
              LOGIN
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
