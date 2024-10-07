import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import config from "../../../../config";

export default function CreateBucketList() {
  const host = config.host;
  const navigate = useNavigate();

  const [bucketListDetails, setBucketListDetails] = useState({
    title: "",
    location: "",
    description: "",
    famousPlace: "",
    totalBudget: "",
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleBucketListDetails = (e) => {
    setBucketListDetails({
      ...bucketListDetails,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!bucketListDetails.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!bucketListDetails.location) {
      newErrors.location = "Location is required";
      isValid = false;
    }
    if (!bucketListDetails.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (!bucketListDetails.famousPlace) {
      newErrors.famousPlace = "Famous place is required";
      isValid = false;
    }
    if (!bucketListDetails.totalBudget) {
      newErrors.totalBudget = "Total budget is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    const tokens = JSON.parse(localStorage.getItem("userToken"));

    if (validateForm()) {
      Axios.post(`${host}/api/bucketlist/bucketListInsert`, bucketListDetails, {
        headers: { "auth-token": tokens },
      })
        .then((res) => {
          if (res.data) {
            setOpen(true);
            setBucketListDetails({
              title: "",
              location: "",
              description: "",
              famousPlace: "",
              totalBudget: "",
            });
          }
        })
        .catch((err) => {
          console.error("Error occurred:", err);
        });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: "20px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Paper
        elevation={5}
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          maxWidth: "100%",
          width: "100%",
          backgroundColor: "#ffffff",
          marginLeft: "0",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "15px 15px 0 0",
          }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ color: "#040000" }}
          >
            Create New Adventure
          </Typography>
          <Link to="/user/travelbucketlist">
            <Button size="small">Explore List</Button>
          </Link>
        </Box>

        <Card
          variant="outlined"
          style={{
            margin: "20px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              {[
                "title",
                "location",
                "description",
                "famousPlace",
                "totalBudget",
              ].map((field) => (
                <Grid item xs={12} key={field}>
                  <Box sx={{ margin: "auto" }}>
                    <TextField
                      id={`outlined-${field}`}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={bucketListDetails[field]}
                      onChange={handleBucketListDetails}
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!errors[field]}
                      helperText={errors[field]}
                      sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  maxWidth: "200px",
                  backgroundColor: "#f39c12 !important",
                }}
                onClick={handleSubmit}
              >
                Submit List
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Inserted!
        </Alert>
      </Snackbar>
    </div>
  );
}
