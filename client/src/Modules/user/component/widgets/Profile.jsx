import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  Input,
} from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import config from "../../../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const host = config.host;
  const [user, setUser] = useState({});
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userToken"));

    axios
      .get(`${host}/api/user/getProfile`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        console.log(res, "hhh");
        setUser(res.data);
        setEditableUser(res.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed.");
      });
  }, [host]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!editableUser.username || editableUser.username.trim() === "") {
      formErrors.username = "Username is required";
    }
    if (!editableUser.email || editableUser.email.trim() === "") {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editableUser.email)) {
      formErrors.email = "Email is invalid";
    }
    if (editableUser.phone && !/^\d{10}$/.test(editableUser.phone)) {
      formErrors.phone = "Phone number is invalid";
    }
    if (!editableUser.address || editableUser.address.trim() === "") {
      formErrors.address = "Address is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (!validateForm()) {
      return;
    }

    const token = JSON.parse(localStorage.getItem("userToken"));
    const formData = new FormData();

    formData.append("username", editableUser.username);
    formData.append("email", editableUser.email);
    formData.append("phone", editableUser.phone);
    formData.append("address", editableUser.address);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    axios
      .put(`${host}/api/user/UpdateUser`, formData, {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        setUser(res.data);
        setEditableUser(res.data);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update profile.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Card sx={{ borderRadius: "30px" }}>
      <ToastContainer />
      <CardHeader
        avatar={
          user.image ? (
            <Avatar
              src={`${host}/api/user-image/${user.image}`}
              aria-label="profile"
              sx={{ width: "90px", height: "90px" }}
            />
          ) : (
            <Avatar sx={{ bgcolor: red[500] }} aria-label="profile">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Avatar>
          )
        }
        action={
          <IconButton
            aria-label="settings"
            onClick={handleEditClick}
            sx={{
              backgroundColor: "#1199b7",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0f7a8c",
              },
            }}
          >
            <EditIcon />
          </IconButton>
        }
        title={user.username}
        subheader={user.email}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Username"
            name="username"
            value={editableUser.username || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label="Email"
            name="email"
            value={editableUser.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Phone"
            name="phone"
            value={editableUser.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            label="Address"
            name="address"
            value={editableUser.address || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.address}
            helperText={errors.address}
          />
          {isEditing && (
            <Box>
              <Input
                type="file"
                onChange={handleImageChange}
                inputProps={{ accept: "image/*" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
                sx={{ mt: 2, background: "#f39c12 !important" }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;
