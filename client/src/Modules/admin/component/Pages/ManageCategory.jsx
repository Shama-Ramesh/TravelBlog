import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  IconButton,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutlineTwoTone as DeleteOutlineTwoToneIcon,
} from "@mui/icons-material";
import Axios from "axios";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ManageCategory = () => {
  const host = config.host;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryData, setCategoryData] = useState({ category: "" });
  const [subcategoryData, setSubcategoryData] = useState({
    subcategory: "",
    category: "",
  });
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({ type: "", data: {} });

  const [categoryError, setCategoryError] = useState("");
  const [subcategoryError, setSubcategoryError] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [deleted]);

  const fetchCategories = () => {
    setLoading(true);
    Axios.get(`${host}/api/category/GetCategory`)
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setLoading(false);
      });
  };

  const fetchSubcategories = () => {
    setLoading(true);
    Axios.get(`${host}/api/subcategory/GetSubcategory`)
      .then((res) => {
        if (res.data) {
          console.log(res.data, "sub");
          setSubcategories(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setLoading(false);
      });
  };

  const handleCategorySubmit = () => {
    if (categoryData.category.trim() === "") {
      setCategoryError("Category is required");
      return;
    }
    setCategoryError("");
    Axios.post(`${host}/api/category/categoryInsert`, categoryData)
      .then((res) => {
        if (res.data) {
          setSnackbar({
            open: true,
            message: "Category inserted successfully",
            severity: "success",
          });
          setCategoryData({ category: "" });
          fetchCategories();
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
        setSnackbar({
          open: true,
          message: "Failed to insert category",
          severity: "error",
        });
      });
  };

  const handleSubcategorySubmit = () => {
    if (
      subcategoryData.subcategory.trim() === "" ||
      subcategoryData.category === ""
    ) {
      setSubcategoryError("Subcategory and Category are required");
      return;
    }
    setSubcategoryError("");
    Axios.post(`${host}/api/subcategory/subcategoryInsert`, subcategoryData)
      .then((res) => {
        if (res.data) {
          setSnackbar({
            open: true,
            message: "Subcategory inserted successfully",
            severity: "success",
          });
          setSubcategoryData({ subcategory: "", category: "" });
          fetchSubcategories();
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
        setSnackbar({
          open: true,
          message: "Failed to insert subcategory",
          severity: "error",
        });
      });
  };

  const handleDeleteItem = (id, type) => {
    const url =
      type === "category"
        ? `${host}/api/category/deleteCategory/${id}`
        : `${host}/api/subcategory/deleteSubcategory/${id}`;
    Axios.delete(url)
      .then((res) => {
        if (res.data) {
          setSnackbar({
            open: true,
            message: `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } deleted successfully`,
            severity: "success",
          });
          setDeleted(!deleted);
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
        setSnackbar({
          open: true,
          message: `Failed to delete ${type}`,
          severity: "error",
        });
      });
  };

  const handleEditItem = (id, type) => {
    const item =
      type === "category"
        ? categories.find((category) => category._id === id)
        : subcategories.find((subcategory) => subcategory._id === id);

    setEditData({ type, data: item });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditData({ type: "", data: {} });
    setEditError("");
  };

  const handleEditSubmit = () => {
    const { type, data } = editData;
    console.log(data);
    if (type === "category" && data.category.category.trim() === "") {
      setEditError("Category is required");
      return;
    }
    if (
      type === "subcategory" &&
      (data.subcategory.trim() === "" || data.category.category.trim() === "")
    ) {
      setEditError("Subcategory and Category are required");
      return;
    }
    setEditError("");
    const url =
      type === "category"
        ? `${host}/api/category/UpdateCategory/${data._id}`
        : `${host}/api/subcategory/UpdateSubcategory/${data._id}`;

    Axios.put(url, data)
      .then((res) => {
        if (res.data) {
          setSnackbar({
            open: true,
            message: `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } updated successfully`,
            severity: "success",
          });
          fetchCategories();
          fetchSubcategories();
          handleCloseEditModal();
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
        setSnackbar({
          open: true,
          message: `Failed to update ${type}`,
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ backgroundColor: "#f0f0f0", borderRadius: 3, p: 4 }}
    >
      <Box
        sx={{
          textAlign: "left",
          mb: 2,
          borderRadius: 3,
          color: "#040000",
          marginTop: "-20px",
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "600" }}
        >
          Manage Travel Blog Categories
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 3,
              p: 4,
              boxShadow: 3,
            }}
          >
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={categoryData.category}
              onChange={(e) =>
                setCategoryData({ ...categoryData, category: e.target.value })
              }
              margin="normal"
              required
              error={Boolean(categoryError)}
              helperText={categoryError}
              sx={{ mb: 3 }}
            />
            <Button
              onClick={handleCategorySubmit}
              variant="contained"
              color="primary"
              sx={{ mb: 3, background: "#040000 !important" }}
            >
              Add Category
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Category List
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <StyledTableRow key={category._id}>
                      <StyledTableCell>{category.category}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() =>
                            handleEditItem(category._id, "category")
                          }
                          size="small"
                          sx={{ color: "#1976d2" }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteItem(category._id, "category")
                          }
                          size="small"
                          sx={{ color: "#d32f2f" }}
                        >
                          <DeleteOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Dialog open={openEditModal} onClose={handleCloseEditModal}>
            <DialogTitle>
              Edit{" "}
              {editData.type.charAt(0).toUpperCase() + editData.type.slice(1)}
            </DialogTitle>
            <DialogContent>
              {editData.type === "category" && (
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={editData.data.category}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      data: { ...editData.data, category: e.target.value },
                    })
                  }
                  margin="normal"
                  required
                  error={Boolean(editError)}
                  helperText={editError}
                />
              )}
              {editData.type === "subcategory" && (
                <>
                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    error={Boolean(editError)}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={editData.data.category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          data: { ...editData.data, category: e.target.value },
                        })
                      }
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Subcategory"
                    name="subcategory"
                    value={editData.data.subcategory}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        data: { ...editData.data, subcategory: e.target.value },
                      })
                    }
                    margin="normal"
                    required
                    error={Boolean(editError)}
                    helperText={editError}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditModal} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default ManageCategory;
