import { styled } from "@mui/system";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Modal,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import axios from "axios";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";
import config from "../../../../config";

// Styled modal box
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "#fff",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

// Styled card
const CardContainer = styled(Card)(({ theme, pinned, visited }) => ({
  minWidth: 275,
  border: pinned ? "3px solid #ffb300" : "none",
  backgroundColor: pinned ? "#fff8e1" : visited ? "#f0f4f7" : "#fff",
  opacity: visited ? 0.6 : 1,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

export default function TravelBucketList() {
  const host = config.host;
  const [bucketlist, setBucketlist] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [deleteCat, setDeleteBucketlist] = useState(false);
  const [pinnedItems, setPinnedItems] = useState(new Set());
  const [visitedItems, setVisitedItems] = useState(new Set());

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    famousPlace: "",
    totalBudget: "",
  });

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
  };

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("userToken"));

    axios
      .get(`${host}/api/bucketlist/getbucketlist`, {
        headers: { "auth-token": tokens },
      })
      .then((res) => {
        setBucketlist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleteCat]);

  const handleOpen = (index) => {
    const item = bucketlist[index];
    setOpen(true);
    setDescription(item.description);
    setRoadmap(item.roadmap);
    setEditItem(item._id);
    setFormData({
      title: item.title,
      location: item.location,
      description: item.description,
      famousPlace: item.famousPlace,
      totalBudget: item.totalBudget,
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${host}/api/bucketlist/deletebucketlist/${id}`)
          .then((response) => {
            setDeleteBucketlist(!deleteCat);
          })
          .catch((err) => {
            console.log("Error : " + err);
          });
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      }
    });
  };

  const handlePin = (id) => {
    setPinnedItems((prev) => {
      const newPinnedItems = new Set(prev);
      if (newPinnedItems.has(id)) {
        newPinnedItems.delete(id);
      } else {
        newPinnedItems.add(id);
      }
      return newPinnedItems;
    });
  };

  const handleVisited = (id) => {
    setVisitedItems((prev) => {
      const newVisitedItems = new Set(prev);
      if (newVisitedItems.has(id)) {
        newVisitedItems.delete(id);
      } else {
        newVisitedItems.add(id);
      }
      return newVisitedItems;
    });
  };

  // Function to sort items, with pinned items first
  const sortedBucketlist = bucketlist.sort((a, b) => {
    const isPinnedA = pinnedItems.has(a._id);
    const isPinnedB = pinnedItems.has(b._id);
    return isPinnedB - isPinnedA; // Pinned items come first
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    axios
      .put(`${host}/api/bucketlist/updatebucketlist/${editItem}`, formData)
      .then((response) => {
        Swal.fire("Updated!", "Category has been updated.", "success");
        setDeleteBucketlist(!deleteCat);
        handleClose();
      })
      .catch((err) => {
        console.log("Error : " + err);
        Swal.fire(
          "Error!",
          "There was a problem updating the category.",
          "error"
        );
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(to bottom left,#ffffff,#ffffff, #ff7f00, #ffffff,#ffffff)",
        padding: "20px",
      }}
    >
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" sx={{ color: "#333", fontWeight: "600" }}>
            Manage Your Travel Bucket List
          </Typography>
          <Link to="/user/create-bucketlist">
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#f39c12",
                "&:hover": { backgroundColor: "#f39c12" },
              }}
              startIcon={<AddIcon />}
              size="small"
            >
              Add Travel Plan
            </Button>
          </Link>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {sortedBucketlist.length > 0 ? (
            <>
              {sortedBucketlist?.map((item, index) => (
                <CardContainer
                  key={item._id}
                  pinned={pinnedItems.has(item._id)}
                  visited={visitedItems.has(item._id)}
                >
                  <Card sx={{ width: 300, height: 300 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "600", color: "#333" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ mb: 1.5, color: "#555" }}>
                        Location: {item.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{ color: "#666", overflowWrap: "break-word" }}
                      >
                        Description: {item.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Famous Place: {item.famousPlace}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Total Budget: {item.totalBudget}
                      </Typography>
                    </CardContent>
                  </Card>
                  <CardActions>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleOpen(index)}
                      sx={{ color: "#007bff" }}
                    >
                      <BorderColorIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(item._id)}
                      sx={{ color: "#dc3545" }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                    <IconButton
                      aria-label="pin"
                      onClick={() => handlePin(item._id)}
                      sx={{ color: "#ffb300" }}
                    >
                      {pinnedItems.has(item._id) ? (
                        <PushPinIcon />
                      ) : (
                        <PushPinOutlinedIcon />
                      )}
                    </IconButton>
                    <IconButton
                      aria-label="visited"
                      onClick={() => handleVisited(item._id)}
                      sx={{ color: "#28a745" }}
                    >
                      {visitedItems.has(item._id) ? (
                        <CheckCircleIcon />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                    </IconButton>
                  </CardActions>
                </CardContainer>
              ))}
            </>
          ) : (
            <>
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
                No Bucketlist found.
              </Typography>
            </>
          )}
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "600", color: "#333" }}
            >
              Edit Travel Plan
            </Typography>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Famous Place"
              name="famousPlace"
              value={formData.famousPlace}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Total Budget"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, background: "#f39c12 !important" }}
              onClick={handleFormSubmit}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}
