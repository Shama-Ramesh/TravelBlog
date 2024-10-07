import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import bg1 from "../../image/bg1.jpeg";

const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4, 4),
  marginTop: theme.spacing(0),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  backgroundImage: `url(${bg1})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "200px",
  color: "#fff",
  textAlign: "center",
  zIndex: 1,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: -1,
  },
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  padding: theme.spacing(1),
  "&:hover": {
    textDecoration: "underline",
  },
}));

const CurrentPageTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#fff",
}));

const BreadcrumbsComponent = ({ currentPageName }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Filter out segments that are likely to be IDs
  const filteredPathnames = pathnames.filter(
    (segment) => !segment.match(/^[0-9a-fA-F]{24}$/)
  );

  return (
    <BreadcrumbContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <BreadcrumbLink component={RouterLink} to="/">
          Home
        </BreadcrumbLink>
        {filteredPathnames.map((value, index) => {
          const to = `/${filteredPathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === filteredPathnames.length - 1;
          return isLast ? (
            <Typography key={to} sx={{ padding: "8px", color: "#fff" }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <BreadcrumbLink component={RouterLink} to={to} key={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </BreadcrumbLink>
          );
        })}
      </Breadcrumbs>
      <CurrentPageTitle>
        {currentPageName ||
          (filteredPathnames.length > 0
            ? filteredPathnames[filteredPathnames.length - 1]
                .charAt(0)
                .toUpperCase() +
              filteredPathnames[filteredPathnames.length - 1].slice(1)
            : "Home")}
      </CurrentPageTitle>
    </BreadcrumbContainer>
  );
};

export default BreadcrumbsComponent;
